pipeline {
    agent any

    environment {
        SONAR_HOST_URL = 'http://104.198.143.112:9000'
        IMAGE_NAME = 'gifttt-app'
        CONTAINER_NAME = 'gifttt-container'
        DEPLOY_IP = '104.198.143.112'
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
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    nvm use 20
                    node -v
                    npm -v
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
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    nvm use 20
                    node -v
                    npm -v
                    npm install
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    nvm use 20
                    CI=false npm run build
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar') {
                    sh '''
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    nvm use 20
                    
                    # Install sonar-scanner if not already installed
                    npm install -g sonar-scanner
                    
                    sonar-scanner \
                    -Dsonar.projectKey=gifttt \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=$SONAR_HOST_URL \
                    -Dsonar.login=$SONAR_AUTH_TOKEN
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t $IMAGE_NAME:latest .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                # Stop and remove old container if exists
                docker rm -f $CONTAINER_NAME || true
                
                # Run new container on port 80
                docker run -d \
                  --name $CONTAINER_NAME \
                  -p 80:5000 \
                  $IMAGE_NAME:latest
                  
                echo "Application deployed successfully on http://$DEPLOY_IP"
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline Success! Website is live on http://$DEPLOY_IP'
        }
        failure {
            echo 'Pipeline Failed'
        }
    }
}