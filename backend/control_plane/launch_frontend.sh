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
npm install -g pm2

# Install project dependencies and build the project
cd /home/ubuntu/hostedservice/frontend
npm run build

sudo apt-get install -y nginx

mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

tee /etc/nginx/sites-available/react-frontend > /dev/null <<EOF
server {
    listen 5173;
    server_name _;

    root /home/ubuntu/hostedservice/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}

EOF

ln -s /etc/nginx/sites-available/react-frontend /etc/nginx/sites-enabled/

systemctl restart nginx

echo "Installation script completed at $(date)" | tee -a /var/log/install.log

