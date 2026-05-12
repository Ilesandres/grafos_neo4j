from flask import Blueprint, jsonify, request

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
    return jsonify(_service.get_stats())


@graph_bp.route("/nodes", methods=["POST"])
def create_node():
    data = request.get_json(silent=True)
    if not data or "labels" not in data or not data["labels"]:
        return jsonify({"error": "labels required"}), 400
    node = _service.create_node(data["labels"], data.get("properties", {}))
    return jsonify({"id": node.id, "labels": node.labels, "properties": node.properties}), 201


@graph_bp.route("/node/<node_id>", methods=["GET"])
def get_node(node_id: str):
    node = _service.get_node(node_id)
    if not node:
        return jsonify({"error": "Node not found"}), 404
    return jsonify({"id": node.id, "labels": node.labels, "properties": node.properties})


@graph_bp.route("/node/<node_id>", methods=["PUT"])
def update_node(node_id: str):
    data = request.get_json(silent=True)
    if not data or "properties" not in data:
        return jsonify({"error": "properties required"}), 400
    node = _service.update_node(node_id, data["properties"])
    if not node:
        return jsonify({"error": "Node not found"}), 404
    return jsonify({"id": node.id, "labels": node.labels, "properties": node.properties})


@graph_bp.route("/node/<node_id>", methods=["DELETE"])
def delete_node(node_id: str):
    deleted = _service.delete_node(node_id)
    if not deleted:
        return jsonify({"error": "Node not found"}), 404
    return jsonify({"message": "Node deleted"}), 200


@graph_bp.route("/relationships", methods=["POST"])
def create_relationship():
    data = request.get_json(silent=True)
    if not data or not data.get("source") or not data.get("target") or not data.get("type"):
        return jsonify({"error": "source, target and type required"}), 400
    rel = _service.create_relationship(data["source"], data["target"], data["type"], data.get("properties", {}))
    return jsonify({
        "id": rel.id,
        "type": rel.type,
        "source": rel.start_node_id,
        "target": rel.end_node_id,
        "properties": rel.properties,
    }), 201
