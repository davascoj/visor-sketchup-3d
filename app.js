const viewer = document.querySelector('#viewer');
const error = document.querySelector('#error');
const defaultOrbit = '45deg 70deg auto';

document.querySelector('#reset-view').addEventListener('click', () => {
  viewer.cameraOrbit = defaultOrbit;
  viewer.jumpCameraToGoal();
});

viewer.addEventListener('error', () => { error.hidden = false; });
