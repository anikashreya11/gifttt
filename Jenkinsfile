pipeline {
    agent any

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

        stage('Run Docker Build') {
            steps {
                sh 'docker build -t giftbloom-app .'
            }
        }
    }
}
