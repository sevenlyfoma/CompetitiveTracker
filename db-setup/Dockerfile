# Use the official PostgreSQL image from the Docker Hub
FROM postgres:latest

# Optional: Set environment variables for the default DB
# Note: In production, use a secrets manager or .env file
ENV POSTGRES_DB=demo_db
ENV POSTGRES_USER=user123
ENV POSTGRES_PASSWORD=password123

# Copy an initialization script to the special docker-entrypoint folder
# Any .sql or .sh scripts here run automatically when the container starts
COPY init.sql /docker-entrypoint-initdb.d/