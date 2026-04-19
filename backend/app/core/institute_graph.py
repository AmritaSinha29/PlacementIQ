from typing import Dict, Any, List
import networkx as nx

class InstituteIntelligenceGraph:
    """
    A knowledge graph connecting institutes, recruiters, programs, and placement outcomes.
    Used for Standout Feature 2 (SF2).
    """
    def __init__(self):
        self.graph = nx.Graph()
        
    def build_from_db(self, institutes_data: List[Dict[str, Any]], recruiters_data: List[Dict[str, Any]]):
        """
        Builds the bipartite graph of Institutes <-> Recruiters based on historical hiring.
        """
        for inst in institutes_data:
            self.graph.add_node(inst["institute_id"], type="institute", tier=inst["tier"])
            
        for rec in recruiters_data:
            self.graph.add_node(rec["recruiter_id"], type="recruiter", sector=rec["sector"])
            
            # Add edges for hiring affinity
            for inst_id in rec.get("hiring_history", []):
                self.graph.add_edge(rec["recruiter_id"], inst_id, weight=1.0)
                
    def get_institute_health_score(self, institute_id: str) -> float:
        """
        Calculates a health score based on degree centrality (recruiter diversity).
        """
        if institute_id not in self.graph:
            return 0.0
            
        centrality = nx.degree_centrality(self.graph)
        return centrality.get(institute_id, 0.0) * 100

graph_engine = InstituteIntelligenceGraph()
