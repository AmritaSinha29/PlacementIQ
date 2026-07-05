"""
Celery application factory.

Uses Redis as both broker and result backend.
Two queues: 'ml' for CPU-heavy ML tasks, 'io' for I/O-heavy tasks.
"""

from celery import Celery

from app.core.config import get_settings

settings = get_settings()


def create_celery_app() -> Celery:
    """Create and configure the Celery application."""
    app = Celery(
        "placementiq",
        broker=settings.celery_broker,
        backend=settings.celery_backend,
    )

    app.conf.update(
        # Serialization
        task_serializer="json",
        accept_content=["json"],
        result_serializer="json",
        timezone="Asia/Kolkata",
        enable_utc=True,

        # Result expiration
        result_expires=3600,  # 1 hour

        # Task routing — separate queues for ML vs IO
        task_routes={
            "app.tasks.ml_tasks.*": {"queue": "ml"},
            "app.tasks.io_tasks.*": {"queue": "io"},
        },

        # Default queue for unrouted tasks
        task_default_queue="default",

        # Retry policy
        task_acks_late=True,
        worker_prefetch_multiplier=1,

        # Concurrency — workers handle one ML task at a time (CPU-bound)
        worker_concurrency=2,

        # Task discovery — explicit imports so the worker registers tasks
        # decorated with @shared_task in these modules on startup.
        imports=(
            "app.tasks.ml_tasks",
            "app.tasks.io_tasks",
        ),

        # Beat schedule for periodic tasks
        beat_schedule={
            "ingest-job-market-data-daily": {
                "task": "app.tasks.io_tasks.ingest_job_market_data_task",
                "schedule": 86400.0,  # Every 24 hours
            },
        },
    )

    return app


# Module-level singleton
celery_app = create_celery_app()
