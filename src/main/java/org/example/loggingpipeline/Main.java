package org.example.loggingpipeline;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.example.loggingpipeline.Producer.Producer;

import java.util.Properties;

public class Main {
    public static void main(String[] args) {
        System.out.println("Kafka Logging Pipeline Example");
        ProducerRecord<String, String> record = new ProducerRecord<>("logging-topic","Hello, Kafka!");
        Properties properties = new Properties();
        KafkaProducer<String, String> kafkaProducer = new KafkaProducer<>(properties);
        Producer producer = new Producer(properties, kafkaProducer);
        producer.sendMessage(record);
    }
}