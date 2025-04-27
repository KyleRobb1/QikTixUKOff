# EventNest Plesk Deployment Guide

This guide provides step-by-step instructions for deploying EventNest using Plesk on AWS.

## Overview

Plesk provides a user-friendly control panel for managing web hosting, making it easier to deploy and maintain your EventNest application compared to a raw AWS setup.

## Step 1: Launch an EC2 Instance with Plesk

1. **Go to AWS Marketplace**:
   - Log in to your AWS Console
   - Navigate to AWS Marketplace (https://aws.amazon.com/marketplace)
   - Search for "Plesk"

2. **Select a Plesk AMI**:
   - Choose "Plesk Obsidian Web Host Edition on Ubuntu 20.04" (or the latest version)
   - Click "Continue to Subscribe"
   - Accept the terms and click "Continue to Configuration"

3. **Configure Instance**:
   - Select your preferred AWS Region
   - Click "Continue to Launch"
   - Choose "Launch through EC2" option

4. **Set Up Instance Details**:
   - Instance Type: Recommend at least t3.medium for production
   - VPC and Subnet: Select your preferred network
   - Auto-assign Public IP: Enable
   - Storage: At least 30GB (more if you expect many uploads)
   - Security Group: Create a new one with these rules:
     - SSH (Port 22) from your IP
     - HTTP (Port 80) from anywhere
     - HTTPS (Port 443) from anywhere
     - Plesk Panel (Port 8443) from your IP
   - Key Pair: Create or select an existing one

5. **Launch the Instance**:
   - Review and click "Launch"
   - Wait for the instance to initialize (about 5-10 minutes)

## Step 2: Initial Plesk Configuration

1. **Connect to Plesk Panel**:
   - Get your instance's public IP from EC2 console
   - Open in browser: `https://your-instance-ip:8443`
   - You'll see a security warning (because of self-signed certificate) - proceed anyway
   - Login credentials will be in the EC2 instance logs:
     ```
     ssh -i your-key.pem ubuntu@your-instance-ip
     sudo cat /root/plesk-initial-credentials.txt
     ```

2. **Complete Initial Setup**:
   - Follow the Plesk setup wizard
   - Choose "Web Admin" edition
   - Enter your license key or activate a trial
   - Set up your admin account

3. **Configure Plesk Settings**:
   - Go to "Tools & Settings" > "Updates & Upgrades"
   - Install recommended extensions:
     - Docker
     - Node.js
     - Git
     - Let's Encrypt
     - PostgreSQL

## Step 3: Set Up Your Domain in Plesk

1. **Add Your Domain**:
   - Go to "Domains" > "Add Domain"
   - Enter your domain name: eventnest.com
   - Select "Create a new subscription"
   - Set up FTP credentials if needed
   - Click "OK"

2. **Configure DNS**:
   - Go to your domain registrar
   - Update DNS A record to point to your EC2 instance's IP
   - Add CNAME record for "www" pointing to your domain

3. **Set Up SSL**:
   - In Plesk, go to your domain
   - Click "SSL/TLS Certificates"
   - Click "Let's Encrypt"
   - Check both your domain and www subdomain
   - Click "Get it Free"

## Step 4: Set Up PostgreSQL Database

1. **Create Database**:
   - In Plesk, go to "Databases"
   - Click "Add Database"
   - Database name: eventnest
   - Database type: PostgreSQL
   - Create a new user with a strong password
   - Note the connection details

## Step 5: Deploy EventNest Using Docker

1. **Prepare Docker Compose File**:
   - Create a directory for your application:
     ```
     ssh -i your-key.pem ubuntu@your-instance-ip
     mkdir -p /var/www/vhosts/eventnest.com/docker
     mkdir -p /var/www/vhosts/eventnest.com/docker/nginx
     mkdir -p /var/www/vhosts/eventnest.com/docker/uploads
     ```

2. **Create Nginx Configuration**:
   - Create a file at `/var/www/vhosts/eventnest.com/docker/nginx/nginx.conf`:
     ```
     server {
         listen 80;
         
         location / {
             proxy_pass http://frontend;
             proxy_http_version 1.1;
             proxy_set_header Upgrade $http_upgrade;
             proxy_set_header Connection 'upgrade';
             proxy_set_header Host $host;
             proxy_cache_bypass $http_upgrade;
         }
         
         location /api {
             proxy_pass http://backend:5000;
             proxy_http_version 1.1;
             proxy_set_header Upgrade $http_upgrade;
             proxy_set_header Connection 'upgrade';
             proxy_set_header Host $host;
             proxy_cache_bypass $http_upgrade;
         }
     }
     ```

3. **Create Docker Compose File**:
   - Create a file at `/var/www/vhosts/eventnest.com/docker/docker-compose.yml`:
     ```yaml
     version: '3.8'

     services:
       backend:
         build:
           context: ./backend
           dockerfile: Dockerfile
         container_name: eventnest-backend
         restart: always
         environment:
           - NODE_ENV=production
           - PORT=5000
           - DB_HOST=localhost
           - DB_NAME=eventnest
           - DB_USER=your_db_user
           - DB_PASSWORD=your_db_password
           - JWT_SECRET=your_jwt_secret
           - FRONTEND_URL=https://eventnest.com
         volumes:
           - ./uploads:/app/uploads
         networks:
           - app-network

       frontend:
         build:
           context: ./frontend
           dockerfile: Dockerfile
         container_name: eventnest-frontend
         restart: always
         networks:
           - app-network
         depends_on:
           - backend

       nginx:
         image: nginx:alpine
         container_name: eventnest-nginx
         restart: always
         ports:
           - "8080:80"
         volumes:
           - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
         networks:
           - app-network
         depends_on:
           - frontend
           - backend

     networks:
       app-network:
         driver: bridge
     ```

4. **Upload Application Files**:
   - Clone your repository to the server:
     ```
     cd /var/www/vhosts/eventnest.com/docker
     git clone https://github.com/your-username/eventnest.git .
     ```
   - Or upload via SFTP/SCP:
     ```
     scp -i your-key.pem -r /path/to/local/eventnest/* ubuntu@your-instance-ip:/var/www/vhosts/eventnest.com/docker/
     ```

5. **Configure Plesk Web Server**:
   - In Plesk, go to your domain settings
   - Click "Apache & nginx Settings"
   - Under "Additional nginx directives", add:
     ```
     location / {
         proxy_pass http://localhost:8080;
         proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection 'upgrade';
         proxy_set_header Host $host;
         proxy_cache_bypass $http_upgrade;
     }
     ```

6. **Deploy with Docker**:
   - SSH into your server
   - Navigate to your application directory:
     ```
     cd /var/www/vhosts/eventnest.com/docker
     ```
   - Build and start the containers:
     ```
     docker-compose up -d
     ```

## Step 6: Set Up Environment Variables

1. **Create .env File**:
   - Create a file at `/var/www/vhosts/eventnest.com/docker/.env` with your configuration:
     ```
     NODE_ENV=production
     PORT=5000
     DB_HOST=localhost
     DB_NAME=eventnest
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     JWT_SECRET=your_jwt_secret
     FRONTEND_URL=https://eventnest.com
     # Add other required environment variables
     ```

2. **Update Docker Compose**:
   - Modify your docker-compose.yml to use the .env file:
     ```yaml
     services:
       backend:
         # ...
         env_file:
           - .env
     ```

## Step 7: Verify Deployment

1. **Check Docker Containers**:
   ```
   docker ps
   docker logs eventnest-backend
   docker logs eventnest-frontend
   ```

2. **Test Your Website**:
   - Visit https://eventnest.com
   - Test user registration and login
   - Test event creation and ticket purchasing
   - Test payment processing

## Maintenance and Updates

### Updating Your Application

1. **Pull Latest Code**:
   ```
   cd /var/www/vhosts/eventnest.com/docker
   git pull origin main
   ```

2. **Rebuild and Restart Containers**:
   ```
   docker-compose down
   docker-compose up -d --build
   ```

### Backups

1. **Database Backup**:
   - In Plesk, go to "Databases"
   - Select your database
   - Click "Back Up"

2. **Files Backup**:
   - In Plesk, go to "Backup Manager"
   - Click "Back Up"
   - Select your domain and configuration

### Monitoring

1. **Container Logs**:
   ```
   docker logs -f eventnest-backend
   docker logs -f eventnest-frontend
   ```

2. **Plesk Resource Usage**:
   - In Plesk, go to "Tools & Settings" > "Resource Usage"

## Troubleshooting

### Common Issues

1. **Application Not Accessible**:
   - Check Docker container status: `docker ps`
   - Check Nginx configuration in Plesk
   - Verify domain DNS settings

2. **Database Connection Issues**:
   - Verify database credentials in .env file
   - Check PostgreSQL service status in Plesk

3. **SSL Certificate Issues**:
   - Renew Let's Encrypt certificate in Plesk
   - Check domain DNS configuration

## Security Best Practices

1. **Keep Plesk Updated**:
   - Regularly check for updates in "Tools & Settings" > "Updates & Upgrades"

2. **Secure SSH Access**:
   - Use key-based authentication only
   - Disable password authentication

3. **Regular Backups**:
   - Schedule automatic backups in Plesk Backup Manager

4. **Firewall Configuration**:
   - Use AWS Security Groups to restrict access
   - Consider using Plesk Firewall extension
