module org.example.loggingpipeline {
    requires kafka.clients;
    opens org.example.loggingpipeline to javafx.fxml;
    exports org.example.loggingpipeline;
}