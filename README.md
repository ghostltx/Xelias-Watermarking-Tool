# Xelias Watermarking Tool

A single-file browser tool for batch watermarking image folders. It runs locally in the browser, keeps image formats unchanged, and can overwrite original files after folder authorization.

## Quick Start

1. Open `index.html` or `Xelias Watermarking Tool.html` in a modern Chromium browser.
2. Click the left import area or the center empty-state card to authorize the original image folder.
3. Adjust watermark layers on the preview canvas.
4. Use `Export Current` or the right-side `Export All` button to write results back to the original folder.

## v1.0.0 Release Highlights

- Renamed the app to **Xelias Watermarking Tool**.
- Added a liquid-glass interface style while preserving the original workflow.
- Added a built-in default AI-generated disclosure watermark.
- Added a watermark asset area: the built-in watermark remains available even if all layers are deleted, and users can still add custom watermark images.
- Added multiple image watermark layers with independent position, scale, opacity, and rotation.
- Added canvas interactions:
  - Drag watermark layers directly in the preview.
  - `Alt + drag` duplicates a watermark layer at the same size and continues dragging the new layer.
  - `Ctrl + Alt + click` deletes a watermark layer.
  - Smart alignment guides and snapping for multiple watermark blocks.
- Added top-bar image metadata: folder/name, resolution, and file size.
- Moved `Export All` to the right-side main action area.
- Kept top-right actions focused on `Clear` and `Export Current`.
- Added center empty-state click-to-import behavior.
- Added glass-style export completion toast and batch export progress strip.
- Added offline layout fallback CSS so the app keeps its three-column layout even if CDN styles load slowly.

## Files

- `index.html` - recommended entry point.
- `Xelias Watermarking Tool.html` - same app with a descriptive filename.
- `Xelias Watermarking Tool-HTML Package.zip` - packaged HTML build.

## Notes

- Folder overwrite export requires the browser File System Access API. Use the latest Chrome or Edge.
- The app works locally; images are processed in the browser.
- Export overwrites the original image files in the authorized folder.
