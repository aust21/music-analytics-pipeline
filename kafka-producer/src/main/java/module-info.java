module org.example.loggingpipeline {
    requires kafka.clients;
    requires com.fasterxml.jackson.databind;
    requires com.fasterxml.jackson.core;

    // Export your data packages to Jackson
    exports org.example.loggingpipeline.Data to com.fasterxml.jackson.databind;
//    exports org.example.loggingpipeline.model to com.fasterxml.jackson.databind;

    // Other exports as needed
    exports org.example.loggingpipeline;
}