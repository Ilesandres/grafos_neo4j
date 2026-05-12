from dataclasses import dataclass, field
from typing import Any


@dataclass
class Node:
    id: str
    labels: list[str]
    properties: dict[str, Any] = field(default_factory=dict)


@dataclass
class Relationship:
    id: str
    type: str
    start_node_id: str
    end_node_id: str
    properties: dict[str, Any] = field(default_factory=dict)


@dataclass
class GraphData:
    nodes: list[Node]
    relationships: list[Relationship]
