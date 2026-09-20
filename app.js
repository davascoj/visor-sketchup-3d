const viewer = document.querySelector('#viewer');
const error = document.querySelector('#error');
const loadingLabel = document.querySelector('#loading-label');
const loadingProgress = document.querySelector('#loading-progress');
const viewerShell = document.querySelector('.viewer-shell');
const defaultOrbit = '45deg 70deg auto';
const viewPresets = {
  front: '0deg 75deg auto',
  side: '90deg 75deg auto',
  top: '0deg 5deg auto',
  iso: defaultOrbit,
};

function resetView() {
  viewer.cameraOrbit = defaultOrbit;
  viewer.jumpCameraToGoal();
}

document.querySelector('#reset-view').addEventListener('click', resetView);

function togglePanel(buttonId, panelId) {
  const button = document.querySelector(buttonId);
  const panel = document.querySelector(panelId);
  button.addEventListener('click', () => {
    const isOpening = panel.hidden;
    document.querySelectorAll('.viewer-panel').forEach((item) => { item.hidden = true; });
    document.querySelectorAll('[aria-controls]').forEach((item) => { item.setAttribute('aria-expanded', 'false'); });
    panel.hidden = !isOpening;
    button.setAttribute('aria-expanded', String(isOpening));
  });
}

togglePanel('#info-toggle', '#info-panel');

document.querySelectorAll('[data-view]').forEach((button) => {
  button.addEventListener('click', () => {
    viewer.cameraOrbit = viewPresets[button.dataset.view];
    viewer.jumpCameraToGoal();
  });
});

document.querySelector('#fullscreen-toggle').addEventListener('click', async () => {
  if (document.fullscreenElement) await document.exitFullscreen();
  else await viewerShell.requestFullscreen();
});

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
viewer.addEventListener('progress', (event) => {
  const percentage = Math.round(event.detail.totalProgress * 100);
  loadingProgress.value = percentage;
  loadingLabel.textContent = `Cargando modelo 3D… ${percentage}%`;
});

