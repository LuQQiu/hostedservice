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
unzip -v /home/ubuntu/main.zip -d /home/ubuntu || { echo "Failed to unzip file"; exit 1; }

# Find the correct folder name after unzipping
unzipped_folder=$(find /home/ubuntu -maxdepth 1 -type d -name "*hostedservice*")
if [ -z "$unzipped_folder" ]; then
    echo "Could not find hostedservice folder"
    ls -la /home/ubuntu
    exit 1
fi

# Move the unzipped folder to the correct location
mv "$unzipped_folder" /home/ubuntu/hostedservice

# Set correct ownership
chown -R ubuntu:ubuntu /home/ubuntu/hostedservice

# Update conf.env
sed -i "s|\${DatabasePath}|${DatabasePath}|g" /home/ubuntu/hostedservice/conf.env
sed -i "s|\${ApplicationZipUrl}|${ApplicationZipUrl}|g" /home/ubuntu/hostedservice/conf.env
sed -i "s|\${ImageId}|${IMAGE_ID}|g" /home/ubuntu/hostedservice/conf.env
sed -i "s|\${PublicSubnet}|${PUBLIC_SUBNET}|g" /home/ubuntu/hostedservice/conf.env
sed -i "s|\${KeyName}|${KEY_PAIR_NAME}|g" /home/ubuntu/hostedservice/conf.env
sed -i "s|\${InstanceType}|${INSTANCE_TYPE}|g" /home/ubuntu/hostedservice/conf.env
sed -i "s|\${ControlPlaneSecurityGroup}|${SECURITY_GROUP}|g" /home/ubuntu/hostedservice/conf.env

# Source the configuration
source /home/ubuntu/hostedservice/conf.env

# Install application dependencies
pip3 install -r /home/ubuntu/hostedservice/python/requirements.txt

# Move service file to correct location
mv /home/ubuntu/hostedservice/data_plane/data_plane.service /etc/systemd/system/data_plane.service

# Start and enable the service
systemctl daemon-reload
systemctl start data_plane
systemctl enable data_plane

echo "User data script completed at $(date)"