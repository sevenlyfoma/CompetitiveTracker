# Stage 1: Build the React frontend
FROM node:25-alpine AS frontend-build
WORKDIR /frontend
# Copy package files first to leverage Docker cache
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build


# Stage 1: Build the application
FROM maven:3.9.12-eclipse-temurin-25-alpine AS build
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

COPY --from=frontend-build /frontend/dist ./src/main/resources/static

# Build the jar file, skipping tests for speed (optional)
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Copy only the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port your Spring Boot app runs on (default 8080)
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]