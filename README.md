## ✈️ airO11y: Mock Airline for Observability Labs

> Welcome to airO11y, the mock airline application held together by duct tape, hope, and a vague understanding of microservices. This repo is used for exploring observability tooling like Datadog, Dynatrace, Grafana, and other sources of budget regret.

---

### 🛠️ Prerequisites

- Docker + Docker Compose
- Node.js (for local development if running outside Docker)
- Python 3 (for the fake pricing microservice)
- MongoDB & Redis (included in `docker-compose.yml`)

---

### 🚀 Running the Full Stack (Recommended)

```bash
docker compose up --build
```

**Access:**

- Client: http://localhost:3000  
- Server: http://localhost:5050  
- Pricing Service: http://localhost:8000  
- MongoDB: localhost:27017  
- Redis: localhost:6379  
- Jaeger UI (for tracing): http://localhost:16686  

---

### 💻 Running Locally Without Docker (if you’re brave)

Start Mongo and Redis yourself. Then:

**Start Backend:**
```bash
cd server
npm install
npm run dev
```

**Start Frontend:**
```bash
cd client
npm install
npm run dev
```

---

### 📦 Environment Variables

Use a `.env` file or export these manually:

```env
MONGO_URI=mongodb://localhost:27017/airo11y
REDIS_HOST=localhost
OTEL_ENABLED=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

---

### 📊 Observability Setup (WIP)

Traces and logs are exported via OpenTelemetry Collector. You can modify `otel-config.yaml` to test different backends (Datadog, Tempo, New Relic, etc).

---

### 🤖 Test Accounts (for pretending to fly places)

- **Email:** demo@airo11y.test  
- **Password:** password123  
- **Status:** Emotionally fragile  
## ✈️ airO11y: Mock Airline for Observability Labs

> Welcome to airO11y, the mock airline application held together by duct tape, hope, and a vague understanding of microservices. This repo is used for exploring observability tooling like Datadog, Dynatrace, Grafana, and other sources of budget regret.

---

### 🛠️ Prerequisites

- Docker + Docker Compose
- Node.js (for local development if running outside Docker)
- Python 3 (for the fake pricing microservice)
- MongoDB & Redis (included in `docker-compose.yml`)

---

### 🚀 Running the Full Stack (Recommended)

```bash
docker compose up --build
```

**Access:**

- Client: http://localhost:3000  
- Server: http://localhost:5050  
- Pricing Service: http://localhost:8000  
- MongoDB: localhost:27017  
- Redis: localhost:6379  
- Jaeger UI (for tracing): http://localhost:16686  

---

### 💻 Running Locally Without Docker (if you’re brave)

Start Mongo and Redis yourself. Then:

**Start Backend:**
```bash
cd server
npm install
npm run dev
```

**Start Frontend:**
```bash
cd client
npm install
npm run dev
```

---

### 📦 Environment Variables

Use a `.env` file or export these manually:

```env
MONGO_URI=mongodb://localhost:27017/airo11y
REDIS_HOST=localhost
OTEL_ENABLED=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

---

### 📊 Observability Setup (WIP)

Traces and logs are exported via OpenTelemetry Collector. You can modify `otel-config.yaml` to test different backends (Datadog, Tempo, New Relic, etc).

---

### 🤖 Test Accounts (for pretending to fly places)

- **Email:** demo@airo11y.test  
- **Password:** password123  
- **Status:** Emotionally fragile  
