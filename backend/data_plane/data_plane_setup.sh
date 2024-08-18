#!/bin/bash

set -ex
exec > >(tee /home/ubuntu/user-data.log) 2>&1

echo "Starting user data script at $(date)"

# Print all environment variables
env

# Update and install dependencies
sudo apt update
sudo apt install -y python3 python3-pip unzip

# Download the application zip file
echo "Downloading application zip from: ${ApplicationZipUrl}"
wget "${ApplicationZipUrl}" -O /home/ubuntu/main.zip || { echo "Failed to download zip file"; exit 1; }

# Unzip the application zip file
echo "Unzipping application"

# Find the correct folder name after unzipping
unzip /home/ubuntu/main.zip -d /home/ubuntu
mv /home/ubuntu/hostedservice-main /home/ubuntu/hostedservice

# Set correct ownership
chown -R ubuntu:ubuntu /home/ubuntu/hostedservice
chmod 777 /home/ubuntu/hostedservice/backend/conf.env

cat <<EOF > /home/ubuntu/hostedservice/backend/conf.env
# This file is compatible with both systemd and bash sourcing
APPLICATION_FOLDER=/home/ubuntu/hostedservice
PYTHONPATH=/home/ubuntu/hostedservice/backend/python

# Control plane
IMAGE_ID=${IMAGE_ID}
PUBLIC_SUBNET=${PUBLIC_SUBNET}
KEY_PAIR_NAME=${KEY_PAIR_NAME}
INSTANCE_TYPE=${INSTANCE_TYPE}
SECURITY_GROUP=${SECURITY_GROUP}
APPLICATION_ZIP_URL=${APPLICATION_ZIP_URL}
DATABASE_PATH=${DATABASE_PATH}

# This line allows the file to be sourced in bash without affecting its use in systemd
export APPLICATION_FOLDER PYTHONPATH IMAGE_ID PUBLIC_SUBNET KEY_PAIR_NAME INSTANCE_TYPE SECURITY_GROUP APPLICATION_ZIP_URL DATABASE_PATH
EOF

# Source the configuration
source /home/ubuntu/hostedservice/backend/conf.env

# Install application dependencies
pip3 install -r /home/ubuntu/hostedservice/backend/python/requirements.txt

# Move service file to correct location
mv /home/ubuntu/hostedservice/backend/data_plane/data_plane.service /etc/systemd/system/data_plane.service

# Start and enable the service
systemctl daemon-reload
systemctl start data_plane
systemctl enable data_plane

echo "User data script completed at $(date)"