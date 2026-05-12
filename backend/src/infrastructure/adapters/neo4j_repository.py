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
        query = """
        MATCH (n)
        OPTIONAL MATCH (n)-[r]->(m)
        RETURN n, r, m
        """
        nodes_map = {}
        rels_map = {}

        with self._driver.session() as session:
            records = session.run(query)
            for record in records:
                n = record.get("n")
                if n and n.element_id not in nodes_map:
                    nodes_map[n.element_id] = Node(
                        id=n.element_id,
                        labels=list(n.labels),
                        properties=dict(n),
                    )
                m = record.get("m")
                if m and m.element_id not in nodes_map:
                    nodes_map[m.element_id] = Node(
                        id=m.element_id,
                        labels=list(m.labels),
                        properties=dict(m),
                    )
                r = record.get("r")
                if r and r.element_id not in rels_map:
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

        query = f"""
        MATCH (n:{label})
        OPTIONAL MATCH (n)-[r]->(m)
        RETURN n, r, m
        """
        nodes_map = {}
        rels_map = {}

        with self._driver.session() as session:
            records = session.run(query)
            for record in records:
                n = record.get("n")
                if n and n.element_id not in nodes_map:
                    nodes_map[n.element_id] = Node(
                        id=n.element_id,
                        labels=list(n.labels),
                        properties=dict(n),
                    )
                m = record.get("m")
                if m and m.element_id not in nodes_map:
                    nodes_map[m.element_id] = Node(
                        id=m.element_id,
                        labels=list(m.labels),
                        properties=dict(m),
                    )
                r = record.get("r")
                if r and r.element_id not in rels_map:
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

    def get_node_count(self) -> int:
        query = "MATCH (n) RETURN count(n) AS count"
        with self._driver.session() as session:
            result = session.run(query).single()
            return result["count"]

    def get_labels(self) -> list[str]:
        query = "CALL db.labels() YIELD label RETURN label"
        with self._driver.session() as session:
            return [r["label"] for r in session.run(query)]
