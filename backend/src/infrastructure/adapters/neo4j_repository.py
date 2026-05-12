import re
from typing import Optional, cast

try:
    from typing import LiteralString
except ImportError:  # pragma: no cover
    from typing_extensions import LiteralString

from neo4j import GraphDatabase
from src.domain.entities.node import Node, Relationship, GraphData
from src.domain.ports.node_repository import NodeRepository
from src.infrastructure.config.settings import settings


class Neo4jRepository(NodeRepository):

    _EMPTY_OR_WS_RE = re.compile(r"^\s*$")

    def __init__(self):
        self._driver = GraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD),
        )

    def close(self):
        self._driver.close()

    @staticmethod
    def _run(session, query: str, **parameters):
        """Run a Cypher query with parameters.

        Neo4j driver type stubs use LiteralString to discourage unsafe string
        interpolation in queries. Here we centralize the cast.
        """
        return session.run(cast(LiteralString, query), **parameters)

    @staticmethod
    def _cypher_escape_identifier(value: str) -> str:
        """Escape a Cypher identifier (label/type) using backticks.

        This allows labels/types with spaces or special characters.
        """
        if Neo4jRepository._EMPTY_OR_WS_RE.match(value or ""):
            raise ValueError("Identifier cannot be empty")
        # In Cypher, a backtick inside an escaped identifier is doubled.
        return f"`{value.replace('`', '``')}`"

    def get_all_nodes(self) -> GraphData:
        nodes_map = {}
        rels_map = {}

        with self._driver.session(database=settings.NEO4J_DATABASE) as session:

            for record in self._run(session, "MATCH (n) RETURN n"):
                n = record["n"]
                if n.element_id not in nodes_map:
                    nodes_map[n.element_id] = Node(
                        id=n.element_id,
                        labels=list(n.labels),
                        properties=dict(n),
                    )

            for record in self._run(session, "MATCH (n)-[r]->(m) RETURN n, r, m"):
                n = record["n"]
                r = record["r"]
                m = record["m"]

                if n.element_id not in nodes_map:
                    nodes_map[n.element_id] = Node(
                        id=n.element_id,
                        labels=list(n.labels),
                        properties=dict(n),
                    )
                if m.element_id not in nodes_map:
                    nodes_map[m.element_id] = Node(
                        id=m.element_id,
                        labels=list(m.labels),
                        properties=dict(m),
                    )
                if r.element_id not in rels_map:
                    rels_map[r.element_id] = Relationship(
                        id=r.element_id,
                        type=r.type,
                        start_node_id=n.element_id,
                        end_node_id=m.element_id,
                        properties=dict(r),
                    )

        return GraphData(
            nodes=list(nodes_map.values()),
            relationships=list(rels_map.values()),
        )

    def get_nodes_by_label(self, label: str) -> GraphData:
        available = self.get_labels()
        if label not in available:
            return GraphData(nodes=[], relationships=[])

        escaped_label = self._cypher_escape_identifier(label)

        nodes_map = {}
        rels_map = {}

        with self._driver.session(database=settings.NEO4J_DATABASE) as session:

            for record in self._run(session, f"MATCH (n:{escaped_label}) RETURN n"):
                n = record["n"]
                nodes_map[n.element_id] = Node(
                    id=n.element_id,
                    labels=list(n.labels),
                    properties=dict(n),
                )

            for record in self._run(
                session,
                f"""
                MATCH (n:{escaped_label})
                OPTIONAL MATCH (n)-[r]->(m)
                RETURN n, r, m
                """,
            ):
                n = record["n"]
                r = record["r"]
                m = record["m"]

                if r and m and r.element_id not in rels_map:
                    rels_map[r.element_id] = Relationship(
                        id=r.element_id,
                        type=r.type,
                        start_node_id=n.element_id,
                        end_node_id=m.element_id,
                        properties=dict(r),
                    )
                if m and m.element_id not in nodes_map:
                    nodes_map[m.element_id] = Node(
                        id=m.element_id,
                        labels=list(m.labels),
                        properties=dict(m),
                    )

        return GraphData(
            nodes=list(nodes_map.values()),
            relationships=list(rels_map.values()),
        )

    def get_node_count(self) -> int:
        with self._driver.session(database=settings.NEO4J_DATABASE) as session:
            record = self._run(session, "MATCH (n) RETURN count(n) AS c").single()
            if not record:
                return 0
            return int(record["c"])

    def get_labels(self) -> list[str]:
        with self._driver.session(database=settings.NEO4J_DATABASE) as session:
            return [r["label"] for r in self._run(session, "CALL db.labels() YIELD label RETURN label")]

    def get_stats(self) -> dict:
        with self._driver.session(database=settings.NEO4J_DATABASE) as session:
            nodes_record = self._run(session, "MATCH (n) RETURN count(n) AS c").single()
            rels_record = self._run(session, "MATCH ()-[r]->() RETURN count(r) AS c").single()
            nodes = int(nodes_record["c"]) if nodes_record else 0
            rels = int(rels_record["c"]) if rels_record else 0
            labels = [r["label"] for r in self._run(session, "CALL db.labels() YIELD label RETURN label")]
            return {"totalNodes": nodes, "totalRelationships": rels, "labels": labels}

    def create_node(self, labels: list[str], properties: dict) -> Node:
        escaped_labels = [self._cypher_escape_identifier(l.strip()) for l in labels if l and l.strip()]
        if not escaped_labels:
            raise ValueError("At least one label is required")
        label_str = ":".join(escaped_labels)
        with self._driver.session(database=settings.NEO4J_DATABASE) as session:
            result = self._run(session, f"CREATE (n:{label_str} $props) RETURN n", props=properties)
            record = result.single()
            if not record:
                raise RuntimeError("Failed to create node")
            n = record["n"]
            return Node(id=n.element_id, labels=list(n.labels), properties=dict(n))

    def get_node(self, node_id: str) -> Optional[Node]:
        with self._driver.session(database=settings.NEO4J_DATABASE) as session:
            result = self._run(session, "MATCH (n) WHERE elementId(n) = $id RETURN n", id=node_id)
            record = result.single()
            if not record:
                return None
            n = record["n"]
            return Node(id=n.element_id, labels=list(n.labels), properties=dict(n))

    def update_node(self, node_id: str, properties: dict) -> Optional[Node]:
        with self._driver.session(database=settings.NEO4J_DATABASE) as session:
            result = self._run(
                session,
                "MATCH (n) WHERE elementId(n) = $id SET n += $props RETURN n",
                id=node_id,
                props=properties,
            )
            record = result.single()
            if not record:
                return None
            n = record["n"]
            return Node(id=n.element_id, labels=list(n.labels), properties=dict(n))

    def delete_node(self, node_id: str) -> bool:
        with self._driver.session(database=settings.NEO4J_DATABASE) as session:
            result = self._run(
                session,
                "MATCH (n) WHERE elementId(n) = $id DETACH DELETE n RETURN count(n) AS deleted",
                id=node_id,
            )
            record = result.single()
            if not record:
                return False
            return int(record["deleted"]) > 0

    def create_relationship(self, source: str, target: str, type: str, properties: dict) -> Relationship:
        escaped_type = self._cypher_escape_identifier(type.strip())
        with self._driver.session(database=settings.NEO4J_DATABASE) as session:
            result = self._run(
                session,
                f"""
                MATCH (a) WHERE elementId(a) = $source
                MATCH (b) WHERE elementId(b) = $target
                CREATE (a)-[r:{escaped_type} $props]->(b)
                RETURN a, r, b
                """,
                source=source,
                target=target,
                props=properties,
            )
            record = result.single()
            if not record:
                raise ValueError("Source or target node not found")
            r = record["r"]
            a = record["a"]
            b = record["b"]
            return Relationship(
                id=r.element_id,
                type=r.type,
                start_node_id=a.element_id,
                end_node_id=b.element_id,
                properties=dict(r),
            )
