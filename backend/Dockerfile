# syntax=docker/dockerfile:1

# Stage 1: Build environment
ARG PYTHON_VERSION=3.12.3
FROM python:${PYTHON_VERSION} as build

# Prevent Python from writing pyc files and buffering stdout and stderr.
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install build dependencies.
RUN apt-get update && apt-get install -y --no-install-recommends gcc python3-dev

# Install Python dependencies.
COPY requirements.txt .
RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt

# Copy the application code.
COPY . .

# Stage 2: Production environment
FROM python:${PYTHON_VERSION}-slim

# Prevent Python from writing pyc files and buffering stdout and stderr.
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Create a non-privileged user.
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

# Copy necessary files from the build stage.
COPY --from=build /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=build /usr/local/bin /usr/local/bin
COPY --from=build /app /app

# Switch to the non-privileged user.
USER appuser

# Expose the port that the application listens on.
EXPOSE 8000

# Use ENTRYPOINT to use shell form and utilize environment variables
ENTRYPOINT ["sh", "-c", "gunicorn main_project.wsgi:application --bind 0.0.0.0:$PORT --workers 3"]
