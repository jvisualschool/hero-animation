#!/bin/bash

# Configuration
SERVER_IP="15.164.161.165"
SSH_USER="bitnami"
SSH_KEY="~/.ssh/jvibeschool_org.pem"
REMOTE_PATH="/opt/bitnami/apache/htdocs/HERO_BG/"
LOCAL_PATH="/Users/jinhojung/Desktop/HERO_BG/"

echo "Starting deployment to ${SERVER_IP}..."

# Ensure remote directory exists
echo "Creating remote directory..."
ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${SSH_USER}@${SERVER_IP} "mkdir -p ${REMOTE_PATH}"

# Sync files
echo "Syncing files..."
rsync -avz -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" --exclude '.git' --exclude 'jinhojung_org_server_config.json' ${LOCAL_PATH} ${SSH_USER}@${SERVER_IP}:${REMOTE_PATH}

echo "Deployment complete!"
echo "Visit: https://jvibeschool.org/HERO_BG/"
