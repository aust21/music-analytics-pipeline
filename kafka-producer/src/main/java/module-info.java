module org.example.loggingpipeline {
    requires kafka.clients;
    requires com.fasterxml.jackson.databind;

    // Export the serializer package to kafka.clients
    exports org.example.loggingpipeline.Helpers to kafka.clients;

    // Other exports as needed
    exports org.example.loggingpipeline;
}