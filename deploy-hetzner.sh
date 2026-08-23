#!/bin/bash
set -e

# Unity TV Hetzner VPS Deployment Script
# Assumes Ubuntu 22.04 or 24.04

echo "=========================================="
echo "Starting Unity TV VPS Deployment..."
echo "=========================================="

# 1. Update system & install dependencies
echo "=> Installing system dependencies..."
sudo apt-get update -y
sudo apt-get install -y curl git ufw nginx software-properties-common python3-certbot-nginx build-essential python3

# 2. Install Node.js 22.x
echo "=> Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 3. Install PM2 globally
echo "=> Installing PM2..."
sudo npm install -g pm2

# 4. Clone / Update Repository
REPO_DIR="/var/www/unitytv"
if [ ! -d "$REPO_DIR" ]; then
    echo "=> Cloning repository..."
    sudo mkdir -p /var/www
    sudo git clone https://github.com/amuka-tech/unitytv.git $REPO_DIR
    sudo chown -R $USER:$USER $REPO_DIR
else
    echo "=> Pulling latest changes..."
    cd $REPO_DIR
    git pull origin main
fi

cd $REPO_DIR

# 5. Install NPM Dependencies
echo "=> Installing npm packages..."
npm install

# 6. Build Next.js Production App
echo "=> Building Next.js App..."
npm run build

# 7. Start PM2 Daemons
echo "=> Starting PM2 services..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup | sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER || true

# 8. Configure Nginx
echo "=> Configuring Nginx..."
cat << 'EOF' | sudo tee /etc/nginx/sites-available/unitytv
server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/unitytv /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo systemctl restart nginx

# 9. Configure UFW Firewall
echo "=> Configuring Firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 1935/tcp
sudo ufw --force enable

echo "=========================================="
echo "Deployment Complete!"
echo "Your app is running on HTTP (Port 80)."
echo "Your RTMP server is running on Port 1935."
echo "If you have a domain name, you can secure it with SSL by running:"
echo "sudo certbot --nginx"
echo "=========================================="
