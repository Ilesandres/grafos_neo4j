from flask import Blueprint, jsonify

from src.infrastructure.adapters.neo4j_repository import Neo4jRepository
from src.domain.services.graph_service import GraphService

graph_bp = Blueprint("graph", __name__, url_prefix="/api/graph")

_repository = Neo4jRepository()
_service = GraphService(_repository)


@graph_bp.route("/nodes", methods=["GET"])
def get_all_nodes():
    data = _service.get_full_graph()
    return jsonify({
        "nodes": [
            {"id": n.id, "labels": n.labels, "properties": n.properties}
            for n in data.nodes
        ],
        "relationships": [
            {
                "id": r.id,
                "type": r.type,
                "source": r.start_node_id,
                "target": r.end_node_id,
                "properties": r.properties,
            }
            for r in data.relationships
        ],
    })


@graph_bp.route("/labels", methods=["GET"])
def get_labels():
    labels = _service.get_available_labels()
    return jsonify({"labels": labels})


@graph_bp.route("/nodes/<label>", methods=["GET"])
def get_nodes_by_label(label: str):
    data = _service.get_graph_by_label(label)
    return jsonify({
        "nodes": [
            {"id": n.id, "labels": n.labels, "properties": n.properties}
            for n in data.nodes
        ],
        "relationships": [
            {
                "id": r.id,
                "type": r.type,
                "source": r.start_node_id,
                "target": r.end_node_id,
                "properties": r.properties,
            }
            for r in data.relationships
        ],
    })


@graph_bp.route("/stats", methods=["GET"])
def get_stats():
    count = _service.get_node_count()
    labels = _service.get_available_labels()
    return jsonify({"totalNodes": count, "labels": labels})
