#!/usr/bin/env bash
set -euo pipefail

# Simple helper to build and run the Next.js app in Docker.

APP_NAME="fe-parthamanunggal"
IMAGE_TAG="${IMAGE_TAG:-${APP_NAME}:latest}"
CONTAINER_NAME="${CONTAINER_NAME:-${APP_NAME}}"
PORT="${PORT:-3000}"

command_exists() { command -v "$1" >/dev/null 2>&1; }

compose_cmd() {
  if command_exists docker; then
    if docker compose version >/dev/null 2>&1; then
      echo "docker compose"
      return
    fi
  fi
  if command_exists docker-compose; then
    echo "docker-compose"
    return
  fi
  echo "" # none
}

container_exists() {
  docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}$"
}

container_running() {
  docker ps --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}$"
}

ensure_docker() {
  if ! command_exists docker; then
    echo "Error: docker not found in PATH" >&2
    exit 1
  fi
}

build() {
  ensure_docker
  echo "[docker-run] Building image: ${IMAGE_TAG}"
  docker build -t "${IMAGE_TAG}" .
}

run() {
  ensure_docker
  local env_args=()
  if [[ -f .env ]]; then
    env_args+=("--env-file" ".env")
  fi

  if container_running; then
    echo "[docker-run] Container '${CONTAINER_NAME}' already running on :${PORT}"
    exit 0
  fi

  if container_exists; then
    echo "[docker-run] Removing existing stopped container '${CONTAINER_NAME}'"
    docker rm "${CONTAINER_NAME}" >/dev/null
  fi

  echo "[docker-run] Starting container: ${CONTAINER_NAME} (port ${PORT})"
  docker run -d \
    --name "${CONTAINER_NAME}" \
    --restart unless-stopped \
    -p "${PORT}:3000" \
    "${env_args[@]}" \
    "${IMAGE_TAG}"

  echo "[docker-run] Logs: docker logs -f ${CONTAINER_NAME}"
}

stop() {
  ensure_docker
  if container_running; then
    echo "[docker-run] Stopping container: ${CONTAINER_NAME}"
    docker stop "${CONTAINER_NAME}" >/dev/null
  fi
  if container_exists; then
    echo "[docker-run] Removing container: ${CONTAINER_NAME}"
    docker rm "${CONTAINER_NAME}" >/dev/null
  fi
}

logs() {
  ensure_docker
  docker logs -f "${CONTAINER_NAME}"
}

shell_in() {
  ensure_docker
  local shell="/bin/sh"
  if docker exec "${CONTAINER_NAME}" command -v bash >/dev/null 2>&1; then
    shell="/bin/bash"
  fi
  docker exec -it "${CONTAINER_NAME}" "${shell}"
}

compose_up() {
  local cmd
  cmd=$(compose_cmd)
  if [[ -z "${cmd}" ]]; then
    echo "Error: docker compose not found" >&2
    exit 1
  fi
  echo "[docker-run] Using ${cmd} up --build -d"
  ${cmd} up --build -d
}

compose_down() {
  local cmd
  cmd=$(compose_cmd)
  if [[ -z "${cmd}" ]]; then
    echo "Error: docker compose not found" >&2
    exit 1
  fi
  echo "[docker-run] Using ${cmd} down"
  ${cmd} down
}

usage() {
  cat <<EOF
Usage: ${0##*/} <command>

Commands:
  up            Build image and run container (default)
  build         Build the Docker image only
  run           Run the container from existing image
  stop          Stop and remove the container
  logs          Follow container logs
  sh            Exec into the container shell
  compose-up    Use docker compose to build and start
  compose-down  Use docker compose to stop

Environment variables:
  IMAGE_TAG        Image tag (default: ${IMAGE_TAG})
  CONTAINER_NAME   Container name (default: ${CONTAINER_NAME})
  PORT             Host port to bind (default: ${PORT})

Examples:
  PORT=4000 ${0##*/} up
  IMAGE_TAG=${APP_NAME}:dev ${0##*/} build
  ${0##*/} compose-up
EOF
}

cmd="${1:-up}"
case "${cmd}" in
  up)
    build
    run
    ;;
  build)
    build
    ;;
  run)
    run
    ;;
  stop)
    stop
    ;;
  logs)
    logs
    ;;
  sh)
    shell_in
    ;;
  compose-up)
    compose_up
    ;;
  compose-down)
    compose_down
    ;;
  -h|--help|help)
    usage
    ;;
  *)
    echo "Unknown command: ${cmd}" >&2
    usage
    exit 1
    ;;
esac

