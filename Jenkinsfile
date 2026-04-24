pipeline {
    agent any

    environment {
        NVM_DIR = "/home/rastrith156/.nvm"
    }

    stages {

        stage('Setup Node') {
            steps {
                sh '''
                export NVM_DIR="$NVM_DIR"
                [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                nvm use 20

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
                    nvm use 20

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
                    nvm use 20

                    npm run build
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                sudo rm -rf /var/www/html/*
                sudo cp -r frontend/build/* /var/www/html/
                sudo systemctl restart nginx
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful"
        }
        failure {
            echo "❌ Pipeline Failed"
        }
    }
}