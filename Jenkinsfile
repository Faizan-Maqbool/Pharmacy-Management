pipeline {
    agent any
    environment {
        COMPOSE_FILE = 'docker-compose.yml'
        COMPOSE_PROJECT_NAME = 'pharmacy-ci'
    }
    stages {
        stage('Checkout') {
            steps {
                // Remove this step if using "Pipeline script from SCM" in Jenkins
                git 'https://github.com/Faizan-Maqbool/Pharmacy-Management.git'
            }
        }
        stage('Build and Start Containers') {
            steps {
                // Use 'docker compose' if you installed the plugin version
                sh "docker compose -p ${COMPOSE_PROJECT_NAME} -f ${COMPOSE_FILE} up --build -d"
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
            sh "docker-compose -p ${env.COMPOSE_PROJECT_NAME} -f ${env.COMPOSE_FILE} down"
        }
    }
}
//
