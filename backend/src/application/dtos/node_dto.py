from dataclasses import dataclass, field
from typing import Any


@dataclass
class CreateNodeDTO:
    labels: list[str]
    properties: dict[str, Any] = field(default_factory=dict)


@dataclass
class UpdateNodeDTO:
    properties: dict[str, Any] = field(default_factory=dict)


@dataclass
class NodeResponseDTO:
    id: str
    labels: list[str]
    properties: dict[str, Any]


@dataclass
class CreateRelationshipDTO:
    source: str
    target: str
    type: str
    properties: dict[str, Any] = field(default_factory=dict)


@dataclass
class RelationshipResponseDTO:
    id: str
    type: str
    source: str
    target: str
    properties: dict[str, Any]
