pipeline {
    agent any

    environment {
        SONAR_HOST_URL = 'http://104.198.143.112:9000'
    }

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/anikashreya11/gifttt.git'
            }
        }

        stage('Install Backend') {
            steps {
                dir('backend') {
                    sh '''
                    export NVM_DIR="$HOME/.nvm"
                    . "$NVM_DIR/nvm.sh"
                    nvm use 20
                    npm install
                    '''
                }
            }
        }

        stage('Install Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                    export NVM_DIR="$HOME/.nvm"
                    . "$NVM_DIR/nvm.sh"
                    nvm use 20
                    npm install
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar') {
                    sh '''
                    sonar-scanner \
                    -Dsonar.projectKey=gifttt \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=$SONAR_HOST_URL \
                    -Dsonar.login=$SONAR_AUTH_TOKEN
                    '''
                }
            }
        }
    }
}