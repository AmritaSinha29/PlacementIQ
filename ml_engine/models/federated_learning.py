import logging

try:
    import flwr as fl
except ImportError:
    # Handle missing dependency gracefully for environments where flwr is not yet installed
    fl = None

def start_federated_server():
    """
    SF7: Federated Learning Pilot Server.
    Aggregates model weights from Tier 1 institutes without exposing raw student data.
    """
    if not fl:
        logging.warning("Flower (flwr) is not installed. Cannot start federated server.")
        return

    logging.info("Starting PlacementIQ Federated Learning Server...")
    
    # Define strategy: FedAvg (Federated Averaging)
    strategy = fl.server.strategy.FedAvg(
        fraction_fit=1.0,  # Sample 100% of available clients for training
        fraction_evaluate=0.5,  # Sample 50% of available clients for evaluation
        min_fit_clients=2,  # Never sample less than 2 clients for training
        min_evaluate_clients=2,  # Never sample less than 2 clients for evaluation
        min_available_clients=2,  # Wait until at least 2 clients are available
    )

    # Start Flower server
    fl.server.start_server(
        server_address="0.0.0.0:8080",
        config=fl.server.ServerConfig(num_rounds=3),
        strategy=strategy,
    )

if __name__ == "__main__":
    start_federated_server()
