const { Kafka } = require("kafkajs");
const WebSocket = require("ws");

// Kafka configuration
const kafka = new Kafka({
  clientId: "kafka-ui-consumer",
  brokers: ["localhost:9092"],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

const consumer = kafka.consumer({
  groupId: "kafka-ui-group",
  sessionTimeout: 30000,
  rebalanceTimeout: 60000,
  heartbeatInterval: 3000,
});

// WebSocket server
const wss = new WebSocket.Server({
  port: 5000,
  perMessageDeflate: false,
});

// Track connected clients
let clientCount = 0;

wss.on("connection", (ws, req) => {
  clientCount++;
  console.log(`New client connected. Total clients: ${clientCount}`);

  // Send connection confirmation
  ws.send(
    JSON.stringify({
      type: "connection",
      message: "Connected to Kafka stream",
      timestamp: new Date().toISOString(),
    })
  );

  ws.on("close", () => {
    clientCount--;
    console.log(`Client disconnected. Total clients: ${clientCount}`);
  });

  ws.on("error", (error) => {
    console.error("WebSocket client error:", error);
  });
});

async function run() {
  try {
    console.log("Connecting to Kafka...");
    await consumer.connect();
    console.log("Connected to Kafka");

    console.log("Subscribing to topic: music-analytics");
    await consumer.subscribe({
      topic: "analytics",
      fromBeginning: true, // Change to true if you want historical messages
    });

    console.log("Starting consumer...");
    await consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat }) => {
        try {
          // Call heartbeat to prevent session timeout
          await heartbeat();

          const messageValue = message.value ? message.value.toString() : "";
          const messageKey = message.key ? message.key.toString() : null;

          // Create formatted message object
          const formattedMessage = {
            topic,
            partition,
            offset: message.offset,
            key: messageKey,
            value: messageValue,
            timestamp: message.timestamp,
            receivedAt: new Date().toISOString(),
            headers: message.headers
              ? Object.entries(message.headers).reduce((acc, [key, value]) => {
                  acc[key] = value.toString();
                  return acc;
                }, {})
              : {},
          };

          // Try to parse JSON if possible
          try {
            formattedMessage.parsedValue = JSON.parse(messageValue);
          } catch (e) {
            // Not JSON, that's fine
            formattedMessage.parsedValue = messageValue;
          }

          console.log(
            `Received message: ${messageValue.substring(0, 100)}${
              messageValue.length > 100 ? "..." : ""
            }`
          );

          // Broadcast to all connected WebSocket clients
          const messageToSend = JSON.stringify(formattedMessage);

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              try {
                client.send(messageToSend);
              } catch (error) {
                console.error("Error sending message to client:", error);
              }
            }
          });
        } catch (error) {
          console.error("Error processing message:", error);
        }
      },
    });
  } catch (error) {
    console.error("Error in Kafka consumer:", error);

    // Attempt to reconnect after 5 seconds
    setTimeout(() => {
      console.log("Attempting to reconnect...");
      run();
    }, 5000);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");

  try {
    await consumer.disconnect();
    console.log("Kafka consumer disconnected");

    wss.clients.forEach((client) => {
      client.close();
    });

    wss.close(() => {
      console.log("WebSocket server closed");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  await consumer.disconnect();
  process.exit(0);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Start the consumer
run().catch(console.error);

console.log("WebSocket server running on ws://localhost:5000");
console.log("Waiting for Kafka messages on topic: music-analytics");
