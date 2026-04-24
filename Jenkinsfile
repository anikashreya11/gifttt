pipeline {
    agent any

    environment {
        NVM_DIR = "/home/rastrith156/.nvm"
        NODE_VERSION = "20"
    }

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/anikashreya11/gifttt.git'
            }
        }

        stage('Setup Node') {
            steps {
                sh '''
                export NVM_DIR="$NVM_DIR"
                [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                nvm install $NODE_VERSION
                nvm use $NODE_VERSION

                node -v
                npm -v
                '''
            }
        }

        stage('Install Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                    export NVM_DIR="$NVM_DIR"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    nvm use $NODE_VERSION

                    npm install
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                    export NVM_DIR="$NVM_DIR"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    nvm use $NODE_VERSION

                    npm run build
                    '''
                }
            }
        }

        stage('Deploy to Nginx') {
            steps {
                sh '''
                sudo rm -rf /var/www/html/*
                sudo cp -r frontend/build/* /var/www/html/
                '''
            }
        }
    }

    post {
        success {
            echo "🚀 Deployment Successful"
        }
        failure {
            echo "❌ Pipeline Failed"
        }
    }
}