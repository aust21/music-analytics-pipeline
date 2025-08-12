# 🎵 Real-Time Music Analytics Pipeline

A comprehensive real-time streaming analytics platform that simulates music interactions across the galaxy. This project demonstrates a complete event-driven architecture using Apache Kafka, featuring music playback tracking, user analytics, and real-time data visualization.

---

## ✨ Features

### 🎶 Music Event Simulation
- **Random music events**: Play, pause, skip, like, and dislike
- **User profiles**: Simulated listeners with unique preferences
- **Dynamic song catalog**: Auto-generated tracks across multiple genres

### 📊 Real-Time Analytics
- **Live event streaming**: Sub-second latency message processing
- **WebSocket integration**: Real-time data push to frontend
- **Interactive dashboard**: Live metrics and user activity visualization
- **Message inspection**: Complete event payloads with metadata

### 🛠️ Production-Ready Infrastructure
- **Containerized deployment**: Docker Compose for easy orchestration
- **Kafka cluster**: Scalable message streaming with persistence
- **Health monitoring**: Container health checks and automatic restarts
- **Development tools**: Redpanda Console for topic management

---

## 🏗️ Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Event Producer** | Java 17 + Maven | Generate and publish music events |
| **Message Broker** | Apache Kafka | Event streaming and persistence |
| **Consumer Service** | Node.js + KafkaJS | Process events and serve WebSocket API |
| **Frontend** | React + WebSockets | Real-time analytics dashboard |
| **Monitoring** | Redpanda Console | Kafka cluster and topic inspection |
| **Infrastructure** | Docker Compose | Container orchestration |

---

## 🎯 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local React development)
- Java 17+ & Maven (for local development)
- Docker desktop

### 1️⃣ Clone & Setup
```bash
git clone https://github.com/aust21/music-analytics-pipeline.git
cd music-analytics-pipeline
```

### 2️⃣ Start Infrastructure
```bash
# Start Kafka, Producer, and WebSocket Server
docker-compose up --build
```
NB: if the services have failed to start, you can start them in docker desktop

**Services will be available at:**
- 🎛️ **Redpanda Console**: http://localhost:8080
- 🔌 **WebSocket Server**: ws://localhost:5000
- 📡 **Kafka Broker**: localhost:9092

### 3️⃣ Start React Dashboard (Local Development)
```bash
cd frontend
npm install
npm start
```
- 📊 **Analytics Dashboard**: http://localhost:3000

---


## 🎮 Usage

### Monitoring Events
1. **Redpanda Console** (http://localhost:8080): View topics, partitions, and message throughput
2. **Docker logs**: `docker logs kafka-producer` to see event generation
3. **WebSocket logs**: `docker logs node-server` for consumer activity


```

---

## 🔧 Development

### Running Components Individually

**Java Producer (Local):**
```bash
cd kafka-producer
mvn clean install
mvn exec:java -Dexec.mainClass="org.example.loggingpipeline.Main"
```

**Node.js Consumer (Local):**
```bash
cd backend
npm install
npm start
```

**Frontend (Local):**
```bash
cd frontend
npm install
npm start
```

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `KAFKA_BOOTSTRAP_SERVERS` | `broker:29092` | Kafka broker address |
| `WS_PORT` | `5000` | WebSocket server port |
| `NODE_ENV` | `development` | Application environment |

---

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---