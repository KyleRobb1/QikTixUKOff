# EventNest AWS Deployment Guide

This guide provides step-by-step instructions for deploying the EventNest application to AWS using Docker and GitHub Actions.

## Architecture Overview

The EventNest application is deployed using the following AWS services:

- **EC2**: Hosts the containerized application (frontend and backend)
- **RDS**: PostgreSQL database for storing application data
- **S3**: Storage for event images and other static assets
- **SES**: Email service for sending notifications and support emails
- **Route 53**: DNS management (optional, can use any domain provider)
- **ECR**: Container registry for storing Docker images

## Prerequisites

- AWS account with appropriate permissions
- Domain name registered (e.g., eventnest.com)
- GitHub repository with the EventNest codebase
- Docker and Docker Compose installed locally

## Step 1: Set Up AWS Resources

### 1.1 Create RDS PostgreSQL Database

1. Go to the AWS RDS console
2. Click "Create database"
3. Select "PostgreSQL"
4. Choose "Production" template
5. Configure settings:
   - DB instance identifier: `eventnest-db`
   - Master username: `postgres` (or your preferred username)
   - Master password: Create a secure password
   - DB instance class: Select appropriate size (e.g., db.t3.small)
   - Storage: 20GB (or as needed)
   - Enable storage autoscaling
   - VPC: Create new or use existing
   - Public access: No (for security)
   - Create a new security group: `eventnest-db-sg`
   - Initial database name: `eventnest`
   - Enable automated backups
6. Create database

### 1.2 Create S3 Bucket for Images

1. Go to the AWS S3 console
2. Click "Create bucket"
3. Name: `eventnest-images`
4. Region: Same as your RDS and EC2 (e.g., us-east-1)
5. Block all public access: No (we need public read access)
6. Enable versioning
7. Create bucket
8. After creation, go to the bucket and set up CORS configuration:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["https://eventnest.com"],
        "ExposeHeaders": []
    }
]
```

### 1.3 Set Up AWS SES for Email

1. Go to the AWS SES console
2. Verify your domain and email addresses
3. If in sandbox mode, request production access
4. Create SMTP credentials for the application

### 1.4 Create ECR Repositories

1. Go to the AWS ECR console
2. Create two repositories:
   - `eventnest-frontend`
   - `eventnest-backend`

### 1.5 Create EC2 Instance

1. Go to the AWS EC2 console
2. Click "Launch instance"
3. Name: `eventnest-app`
4. AMI: Ubuntu Server 22.04 LTS
5. Instance type: t2.small (or larger depending on expected traffic)
6. Key pair: Create new or use existing
7. Network settings:
   - VPC: Same as RDS
   - Auto-assign public IP: Enable
   - Security group: Create new with the following rules:
     - SSH (port 22) from your IP
     - HTTP (port 80) from anywhere
     - HTTPS (port 443) from anywhere
8. Storage: 20GB gp3 (or as needed)
9. Launch instance

## Step 2: Configure EC2 Instance

1. SSH into your EC2 instance:
   ```
   ssh -i your-key.pem ubuntu@your-ec2-public-ip
   ```

2. Copy the `ec2-setup.sh` script to the instance:
   ```
   scp -i your-key.pem ec2-setup.sh ubuntu@your-ec2-public-ip:~/
   ```

3. Execute the setup script:
   ```
   chmod +x ec2-setup.sh
   ./ec2-setup.sh
   ```

4. Set up SSL certificate with Let's Encrypt:
   ```
   sudo certbot --nginx -d eventnest.com -d www.eventnest.com
   ```

5. Configure AWS CLI:
   ```
   aws configure
   ```
   Enter your AWS access key, secret key, and region.

## Step 3: Set Up GitHub Secrets

Add the following secrets to your GitHub repository:

- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `AWS_REGION`: Your AWS region (e.g., us-east-1)
- `EC2_HOST`: Your EC2 instance public IP or DNS
- `EC2_USERNAME`: ubuntu
- `EC2_SSH_KEY`: Your private SSH key (the content of your .pem file)

## Step 4: Configure Environment Variables

1. Create a `.env` file on your local machine based on the `.env.example` template
2. Fill in all the required values with your AWS credentials and configuration
3. Upload the `.env` file to an S3 bucket for secure storage:
   ```
   aws s3 mb s3://eventnest-config
   aws s3 cp .env s3://eventnest-config/.env
   aws s3 cp docker-compose.yml s3://eventnest-config/docker-compose.yml
   ```

## Step 5: Configure DNS

1. In your domain registrar or Route 53, create an A record pointing to your EC2 instance's public IP
2. If using Route 53:
   - Create a hosted zone for your domain
   - Add an A record with name @ pointing to your EC2 IP
   - Add a CNAME record with name www pointing to @

## Step 6: Deploy the Application

1. Push your code to the main branch of your GitHub repository
2. The GitHub Actions workflow will automatically:
   - Build Docker images for frontend and backend
   - Push images to ECR
   - Deploy to your EC2 instance

3. Monitor the deployment in the GitHub Actions tab of your repository

## Step 7: Verify Deployment

1. Visit your domain (https://eventnest.com) to ensure the frontend is working
2. Test API endpoints (https://eventnest.com/api)
3. Test user registration, login, and other features
4. Verify PayPal integration is working in production mode
5. Test email functionality with AWS SES

## Maintenance and Monitoring

### Logs

View application logs:
```
docker-compose logs -f
```

### Updates

To deploy updates, simply push to the main branch and GitHub Actions will handle the deployment.

### Backups

RDS automated backups are enabled. For additional backups:

1. Database:
   ```
   aws rds create-db-snapshot --db-instance-identifier eventnest-db --db-snapshot-identifier eventnest-backup-YYYYMMDD
   ```

2. S3 bucket:
   ```
   aws s3 sync s3://eventnest-images s3://eventnest-backups/images-YYYYMMDD
   ```

### Scaling

For increased traffic:
1. Upgrade EC2 instance type
2. Consider using AWS ECS or EKS for container orchestration
3. Add a load balancer for high availability

## Security Best Practices

1. Regularly update all packages and dependencies
2. Rotate AWS access keys periodically
3. Monitor AWS CloudTrail for suspicious activity
4. Enable AWS GuardDuty for threat detection
5. Use AWS WAF to protect against common web exploits

## Troubleshooting

### Application not accessible
- Check EC2 security groups
- Verify Nginx configuration
- Check Docker container status: `docker-compose ps`

### Database connection issues
- Check RDS security group
- Verify database credentials in .env file
- Test connection from EC2: `psql -h <rds-endpoint> -U postgres -d eventnest`

### Email not sending
- Verify SES is out of sandbox mode
- Check SES credentials
- Verify email addresses are verified

## Estimated Costs

Monthly AWS costs (approximate):
- EC2 t2.small: $20
- RDS db.t3.small: $30
- S3 storage (10GB): $0.25
- SES (1000 emails): $0.10
- Data transfer: Varies based on traffic

Total: ~$50-100/month depending on traffic and usage
