module org.example.loggingpipeline {
    requires javafx.controls;
    requires javafx.fxml;


    opens org.example.loggingpipeline to javafx.fxml;
    exports org.example.loggingpipeline;
}