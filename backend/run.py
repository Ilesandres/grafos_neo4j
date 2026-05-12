from flask import Flask, send_from_directory
from flask_cors import CORS
import os

from src.infrastructure.config.settings import settings
from src.application.routes.graph_routes import graph_bp


def create_app() -> Flask:
    app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")
    CORS(app)

    app.register_blueprint(graph_bp)

    frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        file_path = os.path.join(frontend_dist, path)
        if path and os.path.exists(file_path):
            return send_from_directory(frontend_dist, path)
        index_path = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_path):
            return send_from_directory(frontend_dist, "index.html")
        return {"message": "Neo4j Graph API is running"}, 200

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=settings.FLASK_DEBUG, port=settings.FLASK_PORT)
