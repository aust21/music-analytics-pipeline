# Dockerfile for Java Kafka Producer - Robust JAR handling
FROM maven:3.8.4-openjdk-17 AS build

WORKDIR /app

# Copy Maven configuration files
COPY pom.xml .

# Set Java version environment variables
ENV MAVEN_OPTS="-Dmaven.compiler.source=17 -Dmaven.compiler.target=17"

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests -Dmaven.compiler.source=17 -Dmaven.compiler.target=17

# List the target directory to debug
RUN echo "=== Contents of target directory ===" && ls -la /app/target/

# Runtime stage
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy all JARs from build stage
COPY --from=build /app/target/ ./target/

# Find the executable JAR and copy it
# Priority: shaded/executable JARs, then jar-with-dependencies, then regular JARs
RUN find ./target -name "*-executable.jar" -exec cp {} app.jar \; || \
    find ./target -name "*-jar-with-dependencies.jar" -exec cp {} app.jar \; || \
    find ./target -name "*-shaded.jar" -exec cp {} app.jar \; || \
    find ./target -name "*.jar" ! -name "*-sources.jar" ! -name "*-javadoc.jar" -exec cp {} app.jar \;

# If no JAR was found, create a basic executable JAR from the regular JAR
RUN if [ ! -f app.jar ]; then \
        echo "No executable JAR found, creating one..." && \
        cp ./target/*.jar temp.jar && \
        mkdir -p temp && cd temp && \
        jar -xf ../temp.jar && \
        echo "Main-Class: org.example.loggingpipeline.Main" > META-INF/MANIFEST.MF && \
        jar -cmf META-INF/MANIFEST.MF ../app.jar . && \
        cd .. && rm -rf temp temp.jar; \
    fi

# Verify the JAR file
# RUN ls -la /app/ && echo "JAR file info:" && file app.jar

# Test the JAR has a main class
# RUN java -jar app.jar --help 2>/dev/null || echo "Main class check complete"

# Create non-root user
RUN groupadd -r kafka && useradd -r -g kafka kafka
RUN chown -R kafka:kafka /app && rm -rf ./target/

USER kafka

CMD ["java", "-jar", "app.jar"]