# Multi-stage Dockerfile for CellNoor Google Cloud Run deployment

# Stage 1: Build FastAPI Backend & Python Packages
FROM python:3.11-slim as backend-builder
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY packages/ packages/
COPY workflows/ workflows/
COPY apps/api/ apps/api/
COPY database/ database/

ENV PYTHONPATH=/app

# Stage 2: Final Google Cloud Run Production Image
FROM python:3.11-slim
WORKDIR /app

COPY --from=backend-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend-builder /usr/local/bin /usr/local/bin
COPY --from=backend-builder /app /app

ENV PORT=8080
ENV PYTHONPATH=/app

EXPOSE 8080

CMD ["uvicorn", "apps.api.main:app", "--host", "0.0.0.0", "--port", "8080"]
