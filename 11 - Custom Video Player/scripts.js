// @flow
/** get Elements */
const player = document.querySelector('.player');
const fullscreenButton = player.querySelector('#fullscreen__button');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const ranges = player.querySelectorAll('.player__slider');
const skipButtons = player.querySelectorAll('[data-skip]');
const toggle = player.querySelector('.toggle');
const video = player.querySelector('.viewer');

/** build required fn's */
function scrub({ offsetX }) {
  const { offsetWidth: width } = this;
  const percent = offsetX / width;
  video.currentTime = percent * video.duration;
}

function skip({ target: { dataset: { skip } } }) {
  video.currentTime += parseFloat(skip);
}

function togglePlay() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

function toggleSize() {
  if (document.webkitFullscreenElement) {
    document.webkitExitFullscreen();
  } else {
    player.webkitRequestFullScreen();
  }
}

function updateButton() {
  toggle.textContent = this.paused ? '►' : '❚ ❚';
}

function updateProgressBar() {
  const percent = video.currentTime / video.duration * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function updateRange({ target: { value, name } }) {
  video[name] = value;
}

/** hook up eventListeners */
fullscreenButton.addEventListener('click', toggleSize);

progress.addEventListener('click', scrub);
progress.addEventListener('mousedown', () =>
  progress.addEventListener('mousemove', scrub)
);
progress.addEventListener('mouseup', () =>
  progress.removeEventListener('mousemove', scrub)
);
progress.addEventListener('mouseout', () =>
  progress.removeEventListener('mousemove', scrub)
);

ranges.forEach(range => {
  range.addEventListener('mousedown', () =>
    range.addEventListener('mousemove', updateRange)
  );
  range.addEventListener('mouseup', () =>
    range.removeEventListener('mousemove', updateRange)
  );
});

skipButtons.forEach(skipButton => skipButton.addEventListener('click', skip));

toggle.addEventListener('click', togglePlay);

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', updateProgressBar);
