from neo4j import GraphDatabase
from src.domain.entities.node import Node, Relationship, GraphData
from src.domain.ports.node_repository import NodeRepository
from src.infrastructure.config.settings import settings


class Neo4jRepository(NodeRepository):

    def __init__(self):
        self._driver = GraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD),
        )

    def close(self):
        self._driver.close()

    def get_all_nodes(self) -> GraphData:
        nodes_map = {}
        rels_map = {}

        with self._driver.session() as session:

            for record in session.run("MATCH (n) RETURN n"):
                n = record["n"]
                if n.element_id not in nodes_map:
                    nodes_map[n.element_id] = Node(
                        id=n.element_id,
                        labels=list(n.labels),
                        properties=dict(n),
                    )

            for record in session.run("MATCH (n)-[r]->(m) RETURN n, r, m"):
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
                        start_node_id=r.start_node.element_id,
                        end_node_id=r.end_node.element_id,
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

        nodes_map = {}
        rels_map = {}

        with self._driver.session() as session:

            for record in session.run(f"MATCH (n:{label}) RETURN n"):
                n = record["n"]
                nodes_map[n.element_id] = Node(
                    id=n.element_id,
                    labels=list(n.labels),
                    properties=dict(n),
                )

            for record in session.run(
                f"""
                MATCH (n:{label})
                OPTIONAL MATCH (n)-[r]->(m)
                RETURN n, r, m
                """
            ):
                r = record.get("r")
                m = record.get("m")

                if r and r.element_id not in rels_map:
                    rels_map[r.element_id] = Relationship(
                        id=r.element_id,
                        type=r.type,
                        start_node_id=r.start_node.element_id,
                        end_node_id=r.end_node.element_id,
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
        with self._driver.session() as session:
            return session.run("MATCH (n) RETURN count(n) AS c").single()["c"]

    def get_labels(self) -> list[str]:
        with self._driver.session() as session:
            return [r["label"] for r in session.run("CALL db.labels() YIELD label RETURN label")]

    def get_stats(self) -> dict:
        with self._driver.session() as session:
            nodes = session.run("MATCH (n) RETURN count(n) AS c").single()["c"]
            rels = session.run("MATCH ()-[r]->() RETURN count(r) AS c").single()["c"]
            labels = [r["label"] for r in session.run("CALL db.labels() YIELD label RETURN label")]
            return {"totalNodes": nodes, "totalRelationships": rels, "labels": labels}

    def create_node(self, labels: list[str], properties: dict) -> Node:
        label_str = ":".join(labels)
        with self._driver.session() as session:
            result = session.run(
                f"CREATE (n:{label_str} $props) RETURN n",
                props=properties,
            )
            n = result.single()["n"]
            return Node(id=n.element_id, labels=list(n.labels), properties=dict(n))

    def get_node(self, node_id: str) -> Node | None:
        with self._driver.session() as session:
            result = session.run(
                "MATCH (n) WHERE elementId(n) = $id RETURN n",
                id=node_id,
            )
            record = result.single()
            if not record:
                return None
            n = record["n"]
            return Node(id=n.element_id, labels=list(n.labels), properties=dict(n))

    def update_node(self, node_id: str, properties: dict) -> Node | None:
        with self._driver.session() as session:
            result = session.run(
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
        with self._driver.session() as session:
            result = session.run(
                "MATCH (n) WHERE elementId(n) = $id DETACH DELETE n RETURN count(n) AS deleted",
                id=node_id,
            )
            return result.single()["deleted"] > 0

    def create_relationship(self, source: str, target: str, type: str, properties: dict) -> Relationship:
        with self._driver.session() as session:
            result = session.run(
                f"""
                MATCH (a) WHERE elementId(a) = $source
                MATCH (b) WHERE elementId(b) = $target
                CREATE (a)-[r:`{type}` $props]->(b)
                RETURN r
                """,
                source=source,
                target=target,
                props=properties,
            )
            r = result.single()["r"]
            return Relationship(
                id=r.element_id,
                type=r.type,
                start_node_id=r.start_node.element_id,
                end_node_id=r.end_node.element_id,
                properties=dict(r),
            )
