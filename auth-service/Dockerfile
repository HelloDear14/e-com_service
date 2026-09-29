# 1. Base Image: Downloads a minimal Linux OS with Java 17 Runtime pre-installed
FROM eclipse-temurin:17-jre

# 2. Working Directory: Sets the default folder inside the container to /app
WORKDIR /app

# 3. Copy File: Takes your compiled Spring Boot .jar from your computer's target/ folder
#    and copies it into the container, renaming it to app.jar
COPY target/*.jar app.jar

# 4. Port Documentation: Informs Docker that the app inside listens on port 8080
EXPOSE 8080

# 5. Startup Command: The exact command executed when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]