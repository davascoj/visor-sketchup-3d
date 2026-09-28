const viewer = document.querySelector('#viewer');
const error = document.querySelector('#error');
const loadingLabel = document.querySelector('#loading-label');
const loadingProgress = document.querySelector('#loading-progress');
const viewerShell = document.querySelector('.viewer-shell');
const projects = {
  'plataformas-nuevo-mexico': {
    name: 'Plataformas de Acceso Nuevo México',
    src: 'models/modelo.glb?v=20260918-0950',
    iosSrc: 'models/modelo.usdz',
    measures: '31,15 m × 11,07 m × 5,44 m',
    origin: 'Contorno geométrico calculado desde el modelo GLB. Confirma las cotas de obra con los planos.',
    materials: 'El modelo contiene 45 materiales visuales. La especificación técnica y cantidades deben añadirse manualmente.',
    notes: 'Agrega aquí datos aprobados de diseño, instalación o mantenimiento cuando estén disponibles.',
  },
  'herramienta-opg-05-000-kzb': {
    name: 'Herramienta OPG 05+000 KZB',
    src: 'models/herramienta-opg-05-000-kzb.glb?v=20260928-1',
    measures: 'Información de medidas pendiente de confirmar en los planos del proyecto.',
    origin: 'Modelo 3D correspondiente al proyecto Herramienta OPG 05+000 KZB.',
    materials: 'Consulta las especificaciones técnicas aprobadas para confirmar materiales y cantidades.',
    notes: 'Agrega aquí datos aprobados de diseño, instalación o mantenimiento cuando estén disponibles.',
  },
  'modelo-3d-km-5-000-guaya': {
    name: 'Modelo 3D KM 5+000 Guaya',
    src: 'models/modelo-3d-km-5-000-guaya.glb?v=20260928-1',
    measures: 'Información de medidas pendiente de confirmar en los planos del proyecto.',
    origin: 'Modelo 3D correspondiente al proyecto KM 5+000 Guaya.',
    materials: 'Consulta las especificaciones técnicas aprobadas para confirmar materiales y cantidades.',
    notes: 'Agrega aquí datos aprobados de diseño, instalación o mantenimiento cuando estén disponibles.',
  },
};
const requestedProject = new URLSearchParams(window.location.search).get('modelo');
const projectId = Object.hasOwn(projects, requestedProject) ? requestedProject : 'plataformas-nuevo-mexico';
const project = projects[projectId];

// Se actualiza el atributo, no solo la propiedad, porque model-viewer se carga
// como módulo y debe recibir el cambio incluso si aún no terminó de inicializarse.
viewer.setAttribute('src', project.src);
viewer.setAttribute('alt', `Modelo 3D de ${project.name}`);
if (project.iosSrc) viewer.setAttribute('ios-src', project.iosSrc);
else viewer.removeAttribute('ios-src');
document.title = `${project.name} | Visor 3D`;
document.querySelector('#project-title').textContent = project.name;
document.querySelector('#project-measures').textContent = project.measures;
document.querySelector('#project-origin').textContent = project.origin;
document.querySelector('#project-materials').textContent = project.materials;
document.querySelector('#project-notes').textContent = project.notes;
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
togglePanel('#projects-toggle', '#projects-panel');

const projectList = document.querySelector('#project-list');
Object.entries(projects).forEach(([id, item]) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = item.name;
  button.addEventListener('click', () => {
    const url = new URL(window.location.href);
    url.searchParams.set('modelo', id);
    window.location.href = url.toString();
  });
  projectList.append(button);
});

if (requestedProject && Object.hasOwn(projects, requestedProject)) {
  document.querySelector('#projects-toggle').hidden = true;
}

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

