# Backend — API Neo4j con Flask

API REST para consultar y visualizar datos de una base de datos Neo4j, construida con **arquitectura hexagonal**.

## Arquitectura Hexagonal

```
src/
├── domain/
│   ├── entities/          # Node, Relationship, GraphData (dataclasses)
│   ├── ports/             # NodeRepository (interfaz abstracta)
│   └── services/          # GraphService (casos de uso)
├── infrastructure/
│   ├── adapters/          # Neo4jRepository (implementación con driver Bolt)
│   └── config/            # Settings desde variables de entorno
└── application/
    └── routes/            # Flask Blueprint /api/graph/*
```

### Principios

- **Domain** no depende de nada externo
- **Infrastructure** implementa los puertos definidos en domain
- **Application** orquesta usando servicios del dominio

## Configuración

Variables de entorno en `.env`:

| Variable | Default | Descripción |
|----------|---------|-------------|
| `NEO4J_URI` | `neo4j://127.0.0.1:7687` | URI de conexión Bolt |
| `NEO4J_USER` | `neo4j` | Usuario de Neo4j |
| `NEO4J_PASSWORD` | `Asdf1234*` | Contraseña de Neo4j |
| `FLASK_ENV` | `development` | Entorno Flask |
| `FLASK_DEBUG` | `1` | Modo debug |
| `FLASK_PORT` | `5000` | Puerto del servidor |

## Instalación

```bash
python -m venv env
.\env\Scripts\Activate.ps1
pip install -r requirements.txt
python run.py
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/graph/nodes` | Todos los nodos + relaciones |
| GET | `/api/graph/nodes/:label` | Nodos de un label específico |
| GET | `/api/graph/labels` | Lista de labels disponibles |
| GET | `/api/graph/stats` | Total de nodos y labels |
