# Makefile for AirO11y MERN App Development

# Marks all targets as phony (i.e., always run)
.PHONY: dev server client docker-up docker-stop clean help

# Help menu (run with: make help)
help:
	@echo "📦 AirO11y Dev Makefile Commands:"
	@echo "  make dev         - Start backend, frontend, and DB services"
	@echo "  make server      - Run Express backend only"
	@echo "  make client      - Run React frontend only"
	@echo "  make docker-up   - Start Mongo and Redis in Docker"
	@echo "  make docker-stop - Stop Docker services"
	@echo "  make clean       - Remove logs and reset state"

# Start Mongo & Redis using Docker Compose
docker-up:
	@echo "🔋 Starting Mongo and Redis..."
	docker compose up -d mongo redis

# Stop all Docker services
docker-stop:
	@echo "🛑 Stopping Mongo and Redis..."
	docker compose stop

# Start Express backend
server:
	@echo "🧠 Starting Express backend..."
	cd server && node index.js

# Start Vite frontend
client:
	@echo "🎨 Starting React frontend..."
	cd client && npm run dev

# Run full dev stack in two parallel processes
dev: docker-up
	@echo "🚀 Starting full stack dev environment..."
	@make -j2 server client

# Clean logs (optional enhancement)
clean:
	@echo "🧹 Cleaning logs and temp files..."
	rm -rf server/logs/*
