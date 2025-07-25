package org.example.loggingpipeline.Producer;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;
import java.util.concurrent.Future;

public class Producer {
    private Properties properties;
    private KafkaProducer<String, String> producer;

    public Producer(Properties properties, KafkaProducer<String, String> producer) {
        this.properties = properties;
        this.producer = producer;
    }
    public Future<RecordMetadata> sendMessage(ProducerRecord<String, String> message) {
        System.out.println("Sending message: " + message.value());
        return producer.send(message, (metadata, exception)-> {
            if (exception != null) {
                System.err.println("Errpr sending message: "+exception.getMessage());
            }else {
                System.out.println("Message sent successfully to topic: "+metadata.topic() +
                        " partition: " + metadata.partition() +
                        " offset: " + metadata.offset() +
                        " timestamp: " + metadata.timestamp());
            }
        });
    }

    public void flush() {
        System.out.println("Flushing producer...");
        producer.flush();
        System.out.println("Producer flushed successfully.");
    }

    public void close() {
        System.out.println("Closing producer...");
        producer.close();
        System.out.println("Producer closed successfully.");
    }
}
