pipeline {
    agent any
    environment {
        // Optionally specify compose file and project name if using a custom one
        COMPOSE_FILE = 'docker-compose.yml' // Or 'docker-compose.ci.yml' if that's your file
        COMPOSE_PROJECT_NAME = 'pharmacy-ci'
    }
    stages {
        stage('Checkout') {
            steps {
                // Checkout your GitHub repo
                git 'https://github.com/Faizan-Maqbool/Pharmacy-Management.git'
            }
        }
        stage('Build and Start Containers') {
            steps {
                // Build and bring up containers
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
            // Take down the containers after the job, so each run is clean
            sh "docker-compose -p ${COMPOSE_PROJECT_NAME} -f ${COMPOSE_FILE} down"
        }
    }
}

