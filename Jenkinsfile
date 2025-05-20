pipeline {
    agent any
    environment {
        COMPOSE_FILE = 'docker-compose.yml'
        COMPOSE_PROJECT_NAME = 'pharmacy-ci'
    }
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/Faizan-Maqbool/Pharmacy-Management.git'
            }
        }
        stage('Build and Start Containers') {
            steps {
                sh "docker-compose -p ${COMPOSE_PROJECT_NAME} -f ${COMPOSE_FILE} up --build -d"
            }
        }
        stage('Show Running Containers') {
            steps {
                sh "docker ps"
            }
        }
    }
    post {
        always {
            // Clean up containers after the job
            sh "docker compose -p ${COMPOSE_PROJECT_NAME} -f ${COMPOSE_FILE} down || true"
        }
    }
}
