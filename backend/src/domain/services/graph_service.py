from src.domain.entities.node import GraphData
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
