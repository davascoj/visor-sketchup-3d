# Visor 3D de proyectos

Este repositorio publica modelos 3D interactivos mediante GitHub Pages.

## Enlaces por proyecto

- Plataforma actual: `?modelo=plataformas-nuevo-mexico`
- Herramienta OPG 05+000 KZB: `?modelo=herramienta-opg-05-000-kzb`

Cada enlace carga únicamente el modelo indicado. Puedes usarlo directamente en un código QR.

## Actualizar el modelo desde GitHub Desktop

No necesitas crear una rama ni hacer un *merge* para actualizar un modelo: solo reemplázalo, confirma el cambio y publícalo.

1. En SketchUp 2025 selecciona **Archivo > Exportar > Modelo 3D** y elige **GLTF Binary File (`*.glb`)**.
2. Guarda el archivo exportado con el nombre `modelo.glb`.
3. En el Explorador de archivos abre la carpeta `models` de este repositorio y reemplaza el archivo existente.
4. Abre **GitHub Desktop**. Verás un único archivo modificado: `models/modelo.glb`.
5. En el cuadro inferior escribe `Actualizar modelo 3D` y pulsa **Commit to main**.
6. Pulsa **Push origin** en la barra superior.
7. Espera uno o dos minutos y abre el mismo enlace del visor.

El nombre y la ruta del archivo deben mantenerse exactamente como `models/modelo.glb`.

## Vista local

Abre el proyecto mediante un servidor web local (por ejemplo, VS Code Live Server). No abras `index.html` directamente desde el explorador, porque algunos navegadores bloquean la carga de archivos locales.
