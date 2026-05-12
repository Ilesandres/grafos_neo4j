# Neo4j Graph Explorer

Visualizador interactivo de bases de datos Neo4j con backend en Python/Flask y frontend en React.

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | Python 3.12 + Flask + `neo4j-driver` |
| Frontend | React 19 + Vite + `react-force-graph-2d` |
| Base de datos | Neo4j (Bolt `neo4j://127.0.0.1:7687`) |
| Arquitectura | Hexagonal (Domain / Infrastructure / Application) |

## Estructura

```
neo4j-graph-explorer/
├── backend/               # API REST con Flask
│   ├── src/
│   │   ├── domain/        # Entidades, puertos, servicios
│   │   ├── infrastructure/ # Adaptadores (Neo4j), configuración
│   │   └── application/   # Rutas Flask
│   ├── .env / .env.example
│   ├── requirements.txt
│   └── run.py
├── frontend/              # SPA con React + Vite
│   ├── src/
│   │   ├── components/    # Landing, Layout, Views
│   │   ├── pages/         # HomePage, AppPage
│   │   └── services/      # api.js
│   ├── .env / .env.example
│   └── vite.config.js
└── README.md
```

## Requisitos

- **Python 3.12+**
- **Node.js 20+**
- **Neo4j** corriendo en `127.0.0.1:7687`

## Configuración

### Backend

```bash
cd backend

# Crear y activar entorno virtual
python -m venv env
.\env\Scripts\Activate.ps1    # Windows PowerShell
# source env/bin/activate     # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Editar .env si es necesario (valores por defecto ya incluidos)
# NEO4J_URI=neo4j://127.0.0.1:7687
# NEO4J_USER=neo4j
# NEO4J_PASSWORD=Asdf1234*

# Iniciar servidor
python run.py
# → http://127.0.0.1:5000
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
# → http://127.0.0.1:5173

# Build para producción
npm run build
# → frontend/dist/
```

El frontend en desarrollo proxy automaticalas llamadas `/api/*` al backend en `127.0.0.1:5000`.

## Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/graph/nodes` | Todos los nodos y relaciones |
| GET | `/api/graph/nodes/:label` | Nodos filtrados por label |
| GET | `/api/graph/labels` | Lista de labels disponibles |
| GET | `/api/graph/stats` | Estadísticas (total nodos, labels) |

## Vistas del Frontend

1. **Landing** — Página informativa inicial con features y CTA
2. **Dashboard** — Stats en vivo: total nodos, labels, estado de conexión
3. **Graph View** — Visualización interactiva con grafo force-directed (drag, zoom)
4. **Table View** — Vista tabular con filtro por label
