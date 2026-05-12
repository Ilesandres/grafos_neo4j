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

## Seed Data

El archivo `backend/scripts/seed.cypher` contiene el script `CREATE` completo con 20 nodos y 37 relaciones (personas, microservicios, bases de datos, infraestructura y flujos).

Para cargarlo en Neo4j:

**Opción 1 — Neo4j Browser:** pegar el contenido en el editor y ejecutar.

**Opción 2 — cypher-shell:**
```bash
cd backend
type scripts\seed.cypher | cypher-shell -u neo4j -p Asdf1234*
```

**Opción 3 — PowerShell:**
```powershell
Get-Content scripts\seed.cypher | & "C:\Program Files\Neo4j\bin\cypher-shell.bat" -u neo4j -p Asdf1234*
```

> ⚠️ El script es **idempotente**: cada ejecución crea nuevos nodos (no se salta duplicados). Si quieres reiniciar, ejecuta primero `MATCH (n) DETACH DELETE n`.

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
| POST | `/api/graph/nodes` | Crear un nodo |
| GET | `/api/graph/node/:id` | Obtener un nodo por ID |
| PUT | `/api/graph/node/:id` | Actualizar propiedades de un nodo |
| DELETE | `/api/graph/node/:id` | Eliminar un nodo (con sus relaciones) |
| POST | `/api/graph/relationships` | Crear una relación entre dos nodos |
| GET | `/api/graph/labels` | Lista de labels disponibles |
| GET | `/api/graph/stats` | Estadísticas (total nodos, relaciones, labels) |

## Vistas del Frontend

1. **Landing** — Página informativa inicial con features y CTA
2. **Dashboard** — Stats en vivo: total nodos, labels, estado de conexión
3. **Graph View** — Visualización interactiva con grafo force-directed (drag, zoom)
4. **Table View** — Vista tabular con filtro por label
