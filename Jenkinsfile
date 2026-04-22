pipeline {
    agent any

    tools {
        sonarQubeScanner 'sonarqube'
    }

    environment {
        IMAGE_NAME = 'giftbloom-app'
        CONTAINER_NAME = 'giftbloom-container'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'CI=false npm run build'
                }
            }
        }

        stage('Install Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh '''
                    sonar-scanner \
                    -Dsonar.projectKey=giftBloom \
                    -Dsonar.projectName=giftBloom \
                    -Dsonar.sources=. \
                    -Dsonar.exclusions=node_modules/**,frontend/node_modules/**,backend/node_modules/**,frontend/build/**
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker rm -f $CONTAINER_NAME || true
                docker run -d --name $CONTAINER_NAME -p 80:80 $IMAGE_NAME
                '''
            }
        }
    }

    post {
        success {
            echo 'Build + SonarQube + Deployment Successful!'
        }
        failure {
            echo 'Pipeline Failed!'
        }
    }
}