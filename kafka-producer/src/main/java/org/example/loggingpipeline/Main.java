package org.example.loggingpipeline;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.example.loggingpipeline.Data.Song;
import org.example.loggingpipeline.Data.SongGenerator;
import org.example.loggingpipeline.Data.UserActivity;
import org.example.loggingpipeline.Helpers.JsonSerializer;
import org.example.loggingpipeline.Helpers.JsonUtil;
import org.example.loggingpipeline.Producer.Producer;
import org.apache.kafka.common.serialization.StringSerializer;
import java.util.Collections;
import java.util.Properties;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

public class Main {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        System.out.println("Starting Kafka Producer...");

        // Read Kafka bootstrap servers from environment variable or use default
        String bootstrapServers = System.getenv().getOrDefault("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092");
        System.out.println("Connecting to Kafka at: " + bootstrapServers);

        Properties properties = new Properties();
        properties.setProperty("bootstrap.servers", bootstrapServers);
        properties.setProperty("key.serializer", StringSerializer.class.getName());
        properties.setProperty("value.serializer", StringSerializer.class.getName());
        properties.setProperty("acks", "all");
        properties.setProperty("retries", "3");
        properties.setProperty("buffer.memory", "33554432");
        properties.setProperty("linger.ms", "1");
        properties.setProperty("batch.size", "16384");

        // Add connection timeout settings
        properties.setProperty("request.timeout.ms", "30000");
        properties.setProperty("connections.max.idle.ms", "540000");
        properties.setProperty("metadata.max.age.ms", "30000");

        AdminClient adminClient = AdminClient.create(properties);

        // Add retry logic for topic creation
        boolean topicCreated = false;
        int maxRetries = 5;
        int retryCount = 0;

        while (!topicCreated && retryCount < maxRetries) {
            try {
                createTopic(adminClient);
                topicCreated = true;
            } catch (Exception e) {
                retryCount++;
                System.out.println("Failed to create topic, retry " + retryCount + "/" + maxRetries);
                if (retryCount < maxRetries) {
                    Thread.sleep(5000); // Wait 5 seconds before retry
                } else {
                    System.err.println("Failed to create topic after " + maxRetries + " retries: " + e.getMessage());
                    throw e;
                }
            }
        }

        KafkaProducer<String, String> kafkaProducer = new KafkaProducer<>(properties);
        Producer producer = new Producer(properties, kafkaProducer);
        SongGenerator songGenerator = new SongGenerator();

        try {
            while (true) {
                Song randomSong = songGenerator.generateRandomSong();
                String sessionId = UUID.randomUUID().toString();
                String userId = UUID.randomUUID().toString();
                UserActivity activity = new UserActivity(
                        userId,
                        randomSong,
                        sessionId
                );
                String jsonMessage = JsonUtil.toJson(activity);
                producer.sendMessage("analytics", activity.getUserId(), jsonMessage);
                Thread.sleep(500);
                producer.flush();
                Thread.sleep(1000);
            }

        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        } finally {
            producer.close();
            adminClient.close();
        }
        System.out.println("Producer finished.");
    }

    private static void createTopic(AdminClient adminClient) throws ExecutionException, InterruptedException {
        NewTopic newTopic = new NewTopic("analytics", 1, (short) 1);
        adminClient.createTopics(Collections.singleton(newTopic)).all().get();
        System.out.println("Topic created successfully");
    }
}