package org.example.loggingpipeline;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.example.loggingpipeline.Producer.Producer;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;

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
        try {
            String jsonMessage = "{\"userId\":\"user123\"," +
                    "\"action\":\"playing\"," +
                    "\"artist\":\"Dua lipa\"," +
                    "\"song title\":\"Cold heart\"}";
            ProducerRecord<String, String> jsonRecord = new ProducerRecord<>("analytics", "user123", jsonMessage);
            producer.sendMessage(jsonRecord);

            producer.flush();
            Thread.sleep(1000);

        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        } finally {
            producer.close();
        }

        System.out.println("Producer finished.");
    }
}