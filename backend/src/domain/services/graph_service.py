from typing import Optional

from src.domain.entities.node import GraphData, Node
from src.domain.ports.node_repository import NodeRepository


class GraphService:

    def __init__(self, repository: NodeRepository):
        self._repository = repository

    def get_full_graph(self) -> GraphData:
        return self._repository.get_all_nodes()

    def get_graph_by_label(self, label: str) -> GraphData:
        return self._repository.get_nodes_by_label(label)

    def get_node_count(self) -> int:
        return self._repository.get_node_count()

    def get_available_labels(self) -> list[str]:
        return self._repository.get_labels()

    def get_stats(self) -> dict:
        return self._repository.get_stats()

    def create_node(self, labels: list[str], properties: dict) -> Node:
        return self._repository.create_node(labels, properties)

    def get_node(self, node_id: str) -> Optional[Node]:
        return self._repository.get_node(node_id)

    def update_node(self, node_id: str, properties: dict) -> Optional[Node]:
        return self._repository.update_node(node_id, properties)

    def delete_node(self, node_id: str) -> bool:
        return self._repository.delete_node(node_id)
