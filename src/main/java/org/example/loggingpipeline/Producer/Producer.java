package org.example.loggingpipeline.Producer;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;

public class Producer {
    private Properties properties;
    private KafkaProducer<String, String> producer;

    public Producer(Properties properties, KafkaProducer<String, String> producer) {
        this.properties = properties;
        this.producer = producer;
    }
    public void sendMessage(ProducerRecord<String, String> message) {
        this.properties.setProperty("bootstrap.servers", "localhost:9092");
        this.properties.setProperty("key.serializer", StringSerializer.class.getName());
        this.properties.setProperty("value.serializer", StringSerializer.class.getName());
        producer.send(message);

        producer.flush();
        producer.close();
    }
}
