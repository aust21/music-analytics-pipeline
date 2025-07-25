# Real-Time Music Analytics Pipeline

A real-time Kafka-based streaming pipeline that simulates lifeforms enjoying and interacting with music across the galaxy. Powered by Java, Apache Kafka, and Redpanda Console, this project tracks music playback, likes, and skips in real time — visualized through cosmic dashboards and interstellar insights.

---

## Features

- Simulated music play, like, and skip events
- Random alien user and song generation
- Kafka-based streaming pipeline using topics like `music-events`
- Real-time metrics: top songs, skip rates, active listeners
- Redpanda Console integration for visual topic/message inspection
- Kafka consumer for aggregation and log output

---

## Technologies

- Java 17+
- Maven
- Apache Kafka
- Redpanda Console
- Docker + Docker Compose

## Getting Started

1. Clone the repo

```bash
git clone https://github.com/aust21/music-analytics-pipeline.git
cd music-analytics-pipeline

```

2. Start Kafka and redpanda

```bash
docker compose up -d
```

Redpanda Console will be available at: http://localhost:8080

3. Make sure maven is [installed](https://maven.apache.org/download.cgi)

4. Install the packages

```bash
mvn install
```

5. Start the producer

```bash
mvn exec:java -Dexec.mainClass=org.example.loggingpipeline.Main
```

