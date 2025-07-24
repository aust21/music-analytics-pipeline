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

        KafkaProducer<String, String> kafkaProducer = new KafkaProducer<>(properties);

        Producer producer = new Producer(properties, kafkaProducer);

        ProducerRecord<String, String> record = new ProducerRecord<>("logging-topic", "Hello, Kafka!");
        producer.sendMessage(record);
    }
}