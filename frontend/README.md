# Frontend — Neo4j Graph Explorer

SPA construida con **React 19** + **Vite 6** para visualizar grafos de Neo4j de forma interactiva.

## Librerías principales

| Paquete | Uso |
|---------|-----|
| `react-router-dom` | Enrutamiento (Landing → App con sidebar) |
| `react-force-graph-2d` | Renderizado interactivo del grafo (force-directed) |
| `lucide-react` | Iconos SVG |
| `axios` | Cliente HTTP (opcional, se usa fetch nativo) |

## Vistas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `Landing` | Página informativa con hero, features y CTA |
| `/app` | `DashboardView` | Stats: total nodos, labels, estado conexión |
| `/app/graph` | `GraphView` | Grafo interactivo (drag, zoom, clic) |
| `/app/table` | `TableView` | Tabla con filtro por label |

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
```

El archivo `vite.config.js` tiene un proxy configurado:
```
/api → http://127.0.0.1:5000
```

## Build

```bash
npm run build      # → dist/
```

El build se sirve desde Flask en producción (`backend/run.py` busca `frontend/dist/`).
