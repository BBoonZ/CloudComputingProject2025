terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
  access_key  = var.aws_access_key
  secret_key  = var.aws_secret_key
  token       = var.aws_session_token
}

# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "travel-planner-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "travel-planner-igw"
  }
}

# Public Subnets (instead of private)
resource "aws_subnet" "public_1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"  # Changed from 10.0.1.0/24
  availability_zone = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "travel-planner-public-1"
  }
}

resource "aws_subnet" "public_2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.4.0/24"  # Changed from 10.0.2.0/24
  availability_zone = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "travel-planner-public-2"
  }
}

# Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "travel-planner-public-rt"
  }
}

# Route Table Association
resource "aws_route_table_association" "public_1" {
  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_2" {
  subnet_id      = aws_subnet.public_2.id
  route_table_id = aws_route_table.public.id
}

# DB Subnet Group
resource "aws_db_subnet_group" "default" {
  name       = "travel-planner-subnet-group"
  subnet_ids = [aws_subnet.public_1.id, aws_subnet.public_2.id]  # Changed from private to public

  tags = {
    Name = "Travel Planner DB subnet group"
  }
}

# Security Group for RDS
resource "aws_security_group" "rds" {
  name        = "travel-planner-rds-sg"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Warning: This allows access from anywhere
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "travel-planner-rds-sg"
  }
}

# RDS Instance
resource "aws_db_instance" "travel_planner" {
  identifier           = "travel-planner-db"
  engine              = "postgres"
  engine_version      = "17.4"
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  storage_type        = "gp2"
  
  db_name             = "TravelPlanner"
  username           = var.db_username
  password           = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.default.name
  
  multi_az               = false
  publicly_accessible    = true
  skip_final_snapshot    = true

  backup_retention_period = 1
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"

  tags = {
    Name = "travel-planner-database"
  }
}

# Cognito User Pool
resource "aws_cognito_user_pool" "main" {
  name = "travel-planner-user-pool"
  
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  username_attributes = ["email"]
  auto_verified_attributes = ["email"]

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  schema {
    attribute_data_type = "String"
    name               = "email"
    required           = true
    mutable           = true

    string_attribute_constraints {
      min_length = 7
      max_length = 256
    }
  }

  schema {
    attribute_data_type = "String"
    name               = "name"
    required           = false
    mutable           = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }
}

# Cognito User Pool Client
resource "aws_cognito_user_pool_client" "client" {
  name = "travel-planner-client"

  user_pool_id = aws_cognito_user_pool.main.id
  
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]

  prevent_user_existence_errors = "ENABLED"
  access_token_validity        = 1
  refresh_token_validity      = 30

  token_validity_units {
    access_token  = "days"
    refresh_token = "days"
  }
}

# S3 Bucket for profile uploads
resource "aws_s3_bucket" "profile_uploads" {
  bucket = "travel-planner-profile-uploads-${random_id.suffix.hex}"
  force_destroy = true

  tags = {
    Name = "travel-planner-profile-uploads"
  }
}

# Enable ACL Object Ownership
resource "aws_s3_bucket_ownership_controls" "profile_uploads" {
  bucket = aws_s3_bucket.profile_uploads.id
  
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# Enable ACLs for the bucket
resource "aws_s3_bucket_acl" "profile_uploads" {
  depends_on = [aws_s3_bucket_ownership_controls.profile_uploads]
  
  bucket = aws_s3_bucket.profile_uploads.id
  acl    = "public-read"
}

# S3 Bucket public access block (optional, allow public read for profile images)
resource "aws_s3_bucket_public_access_block" "profile_uploads" {
  bucket = aws_s3_bucket.profile_uploads.id

  block_public_acls   = false
  block_public_policy = false
  ignore_public_acls  = false
  restrict_public_buckets = false
}

# S3 Bucket policy to allow public read (for profile images)
resource "aws_s3_bucket_policy" "profile_uploads_public_read" {
  bucket = aws_s3_bucket.profile_uploads.id
  policy = jsonencode({
    Statement = [
      {
        Effect = "Allow"
        Principal = "*"
        Action = ["s3:GetObject"]
        Resource = ["${aws_s3_bucket.profile_uploads.arn}/*"]
      }
    ]
  })
}

# Random suffix for unique bucket name
resource "random_id" "suffix" {
  byte_length = 4
}

# S3 Bucket CORS configuration for profile uploads
resource "aws_s3_bucket_cors_configuration" "profile_uploads_cors" {
  bucket = aws_s3_bucket.profile_uploads.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = [
      "*"
    ]
    expose_headers = [
      "ETag",
      "x-amz-server-side-encryption",
      "x-amz-request-id",
      "x-amz-id-2"
    ]
    max_age_seconds = 3600
  }
}