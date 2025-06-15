pipeline {
    agent any
    environment {
        COMPOSE_FILE = 'docker-compose.yml'
        COMPOSE_PROJECT_NAME = 'pharmacy-ci'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Faizan-Maqbool/Pharmacy-Management.git'
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

        stage('Run Selenium Tests') {
            steps {
                sh '''
                    echo "[*] Installing Python + pip"
                    apt-get update && apt-get install -y python3 python3-pip

                    echo "[*] Installing requirements"
                    pip3 install -r requirements.txt

                    echo "[*] Running Selenium tests"
                    pytest tests/selenium/test_medicine_inventory.py -v
                '''
            }
        }
    }

    post {
        always {
            echo "[*] Cleaning up Docker containers"
            sh "docker compose -p ${COMPOSE_PROJECT_NAME} -f ${COMPOSE_FILE} down || true"
        }
    }
}
