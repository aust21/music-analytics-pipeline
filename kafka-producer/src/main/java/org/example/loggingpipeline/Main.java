package org.example.loggingpipeline;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.example.loggingpipeline.Data.Song;
import org.example.loggingpipeline.Data.SongGenerator;
import org.example.loggingpipeline.Data.UserActivity;
import org.example.loggingpipeline.Helpers.JsonSerializer;
import org.example.loggingpipeline.Producer.Producer;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;
import java.util.UUID;

public class Main {
    public static void main(String[] args) {
        System.out.println("Starting Kafka Producer...");
        Properties properties = new Properties();

        properties.setProperty("bootstrap.servers", "localhost:9092");
        properties.setProperty("key.serializer", StringSerializer.class.getName());
        properties.setProperty("value.serializer", JsonSerializer.class.getName());
        properties.setProperty("acks", "all");
        properties.setProperty("retries", "3");
        properties.setProperty("buffer.memory", "33554432");
        properties.setProperty("linger.ms", "1");
        properties.setProperty("batch.size", "16384");

        KafkaProducer<String, UserActivity> kafkaProducer = new KafkaProducer<>(properties);
        Producer producer = new Producer(properties, kafkaProducer);
        SongGenerator songGenerator = new SongGenerator();

        try {
            // Generate multiple random activities
            for (int i = 0; i < 5; i++) {
                Song randomSong = songGenerator.generateRandomSong();
                UserActivity activity = new UserActivity(
                        "user" + (i + 1),
                        "playing",
                        randomSong,
                        ""
                );

                System.out.println("Generated activity: " + activity);
                producer.sendMessage("analytics", activity.getUserId(), activity);

                Thread.sleep(500); // Small delay between messages
            }

            producer.flush();
            Thread.sleep(1000);

        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        } finally {
            producer.close();
        }

        System.out.println("Producer finished.");
    }
}