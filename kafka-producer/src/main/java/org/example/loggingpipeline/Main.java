package org.example.loggingpipeline;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.example.loggingpipeline.Data.Song;
import org.example.loggingpipeline.Data.SongGenerator;
import org.example.loggingpipeline.Data.UserActivity;
import org.example.loggingpipeline.Helpers.JsonSerializer;
import org.example.loggingpipeline.Helpers.JsonUtil;
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
        properties.setProperty("value.serializer", StringSerializer.class.getName());
        properties.setProperty("acks", "all");
        properties.setProperty("retries", "3");
        properties.setProperty("buffer.memory", "33554432");
        properties.setProperty("linger.ms", "1");
        properties.setProperty("batch.size", "16384");

        KafkaProducer<String, String> kafkaProducer = new KafkaProducer<>(properties);
        Producer producer = new Producer(properties, kafkaProducer);
        SongGenerator songGenerator = new SongGenerator();

        try {

            for (int i = 0; i < 5; i++) {
                Song randomSong = songGenerator.generateRandomSong();
                UserActivity activity = new UserActivity(
                        "user" + (i + 1),
                        randomSong,
                        "asdfds"
                );

//                System.out.println("Generated activity: " + activity);
                String jsonMessage = JsonUtil.toJson(activity);
//                System.out.println(jsonMessage);
                producer.sendMessage("analytics", activity.getUserId(), jsonMessage);

                Thread.sleep(500);
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