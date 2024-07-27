# syntax=docker/dockerfile:1

# Stage 1: Build environment
ARG PYTHON_VERSION=3.12.3
FROM python:${PYTHON_VERSION}-slim as build

# Prevent Python from writing pyc files and buffering stdout and stderr.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install build dependencies, Python dependencies, and clean up in one layer
COPY requirements.txt .
RUN apt-get update && apt-get install -y --no-install-recommends gcc python3-dev \
    && pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get purge -y --auto-remove gcc python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the application code
COPY . .

# Stage 2: Production environment
FROM python:${PYTHON_VERSION}-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Create a non-privileged user
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

# Copy necessary files from the build stage
COPY --from=build /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=build /usr/local/bin /usr/local/bin
COPY --from=build /app /app

USER appuser

EXPOSE 8000

CMD ["gunicorn", "main_project.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]