from abc import ABC, abstractmethod

from src.domain.entities.node import GraphData


class NodeRepository(ABC):

    @abstractmethod
    def get_all_nodes(self) -> GraphData:
        ...

    @abstractmethod
    def get_nodes_by_label(self, label: str) -> GraphData:
        ...

    @abstractmethod
    def get_node_count(self) -> int:
        ...

    @abstractmethod
    def get_labels(self) -> list[str]:
        ...

    @abstractmethod
    def get_stats(self) -> dict:
        ...
