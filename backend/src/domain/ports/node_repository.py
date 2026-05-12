from abc import ABC, abstractmethod
from typing import Optional

from src.domain.entities.node import GraphData, Node


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

    @abstractmethod
    def create_node(self, labels: list[str], properties: dict) -> Node:
        ...

    @abstractmethod
    def get_node(self, node_id: str) -> Optional[Node]:
        ...

    @abstractmethod
    def update_node(self, node_id: str, properties: dict) -> Optional[Node]:
        ...

    @abstractmethod
    def delete_node(self, node_id: str) -> bool:
        ...
