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
npm install -g pm2 typescript
apt-get install -y nginx

# Install project dependencies and build the project
cd /home/ubuntu/hostedservice/frontend
npm install react react-dom
npm install --save-dev @types/react @types/react-dom
pip3 install setuptools==58.0.4
npm run build

mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

# TODO workardound for permission issue for now
chmod 777 /home
chmod 777 /home/ubuntu
chmod 777 /home/ubuntu/hostedservice

tee /etc/nginx/sites-available/react-frontend > /dev/null <<EOF
server {
    listen 5173;
    server_name _;

    root /home/ubuntu/hostedservice/frontend/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

EOF

ln -s /etc/nginx/sites-available/react-frontend /etc/nginx/sites-enabled/


systemctl restart nginx

echo "Installation script completed at $(date)" | tee -a /var/log/install.log

