#!/bin/bash

set -e

echo "Starting installation script at $(date)" | tee -a /var/log/install.log

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "${NVM_DIR}/nvm.sh" ] && \. "${NVM_DIR}/nvm.sh"

# Load NVM and install Node.js (LTS)
if [ -s "/home/ubuntu/.nvm/nvm.sh" ]; then
  . "/home/ubuntu/.nvm/nvm.sh"
fi
nvm install --lts
nvm use --lts

# Verify installation
node -v
npm -v

# Install project dependencies and build the project
cd /home/ubuntu/hostedservice/frontend
npm install
npm run build

# Serve the application using PM2
pm2 serve build 5173 --spa --name "react-frontend"

# Ensure PM2 starts on system boot
pm2 startup
pm2 save

echo "Installation script completed at $(date)" | tee -a /var/log/install.log
