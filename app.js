const viewer = document.querySelector('#viewer');
const error = document.querySelector('#error');
const defaultOrbit = '45deg 70deg auto';

function resetView() {
  viewer.cameraOrbit = defaultOrbit;
  viewer.jumpCameraToGoal();
}

document.querySelector('#reset-view').addEventListener('click', resetView);

document.querySelectorAll('[data-action]').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    if (action === 'reset') return resetView();

    const orbit = viewer.getCameraOrbit();
    const turn = 15 * Math.PI / 180;
    const tilt = 10 * Math.PI / 180;
    let theta = orbit.theta;
    let phi = orbit.phi;
    let radius = orbit.radius;

    if (action === 'left') theta -= turn;
    if (action === 'right') theta += turn;
    if (action === 'up') phi = Math.max(0.1, phi - tilt);
    if (action === 'down') phi = Math.min(Math.PI - 0.1, phi + tilt);
    if (action === 'zoom-in') radius *= 0.82;
    if (action === 'zoom-out') radius *= 1.22;

    viewer.cameraOrbit = `${theta}rad ${phi}rad ${radius}m`;
    viewer.jumpCameraToGoal();
  });
});

viewer.addEventListener('error', () => { error.hidden = false; });

