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
