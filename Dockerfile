FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
ARG VITE_API_BASE_URL=/
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

FROM gradle:8.10.2-jdk17-alpine AS backend-build
WORKDIR /app

COPY backend /app/backend
COPY --from=frontend-build /app/frontend/dist /app/backend/src/main/resources/static
WORKDIR /app/backend
RUN gradle clean bootJar --no-daemon

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=backend-build /app/backend/build/libs/*.jar /app/app.jar

ENV PORT=8080
EXPOSE 8080

CMD ["java", "-jar", "/app/app.jar"]
