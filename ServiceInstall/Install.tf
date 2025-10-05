##################################################################################
# VARIABLES
##################################################################################

variable "aws_access_key" {}
variable "aws_secret_key" {}
variable "aws_session_token" {}
variable "region" { default = "us-east-1" }

# Network
variable "vpc_cidr" { default = "10.0.0.0/16" }
variable "public_subnet_cidr" { default = "10.0.1.0/24" }
variable "private_subnet_cidr" { default = "10.0.2.0/24" }

# EC2
variable "instance_type" { default = "t2.micro" }
# variable "key_name" {}

# RDS
# variable "db_name" { default = "travelappdb" }
# variable "db_username" { default = "admin" }
# variable "db_password" {}

# S3 / CloudFront
# variable "frontend_bucket_name" {}

# Amplify
variable "github_token" {}

##################################################################################
# PROVIDERS
##################################################################################

provider "aws" {
  access_key  = var.aws_access_key
  secret_key  = var.aws_secret_key
  token       = var.aws_session_token
  region      = var.region
}

##################################################################################
# RESOURCES
##################################################################################

# Create a VPC
resource "aws_vpc" "main" {
  cidr_block            = var.vpc_cidr
  enable_dns_support    = true
  enable_dns_hostnames  = true

  tags = {
    Name = "travelapp-vpc"
  }
}

# Create Subnet Public
resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.public_subnet_cidr
  availability_zone = "us-east-1a"

  tags = {
    Name = "public-subnet"
  }
}

# Create Subnet Private
resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidr
  availability_zone = "us-east-1a"

  tags = {
    Name = "private-subnet"
  }
}

# Create Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "travelapp-igw"
  }
}

# Route Table To Internet Gateway for Public Subnet
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "public-rt"
  }
}

# Associate Public Subnet with Public RT
resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public_rt.id
}

# Create Elastic IP for Private Subnet
resource "aws_eip" "nat" {
  depends_on = [aws_internet_gateway.igw]
}

# Create NAT Gateway
resource "aws_nat_gateway" "natgw" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public.id

  tags = {
    Name = "nat-gateway"
  }
}

# Route Table for Private Subnet
resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.natgw.id
  }

  tags = {
    Name = "private-rt"
  }
}

# Associate Private Subnet with Private RT
resource "aws_route_table_association" "private_assoc" {
  subnet_id      = aws_subnet.private.id
  route_table_id = aws_route_table.private_rt.id
}

##################################################################################
# Frontend
##################################################################################
# 1) S3 Bucket
# resource "aws_s3_bucket" "frontend" {
#   bucket = "frontend-travelapp-bucket"
# }

# resource "aws_s3_bucket_website_configuration" "frontend" {
#   bucket = aws_s3_bucket.frontend.id
#   index_document {
#     suffix = "index.html"
#   }
#   error_document {
#     key = "index.html"
#   }
# }

# Amplify App
resource "aws_amplify_app" "this" {
  name       = "my-travelapp"
  repository = "https://github.com/BBoonZ/CloudComputingProject2025"
  access_token = var.github_token

  enable_branch_auto_build = true
}

# Branch (main)
resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.this.id
  branch_name = "main"

  stage      = "PRODUCTION"
  enable_auto_build = true
}

##################################################################################
# API Backend
##################################################################################
# Create EC2 
resource "aws_instance" "Server" {
  ami           = data.aws_ami.aws-linux.id
  instance_type = var.instance_type
  vpc_security_group_ids = [aws_security_group.ssh_sg.id]
  subnet_id     = aws_subnet.private.id
  private_ip    = "10.0.2.100"
  associate_public_ip_address = true

  tags = {
    Name    = "testEC2"
  }
}

##################################################################################
# Security Group
##################################################################################
# Security Group for ssh
resource "aws_security_group" "ssh_sg" {
  name        = "ssh_sg"
  description = "Allow SSH"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ssh-sg"
  }
}


##################################################################################
# DATA
##################################################################################
data "aws_ami" "aws-linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

##################################################################################
# OUTPUT
##################################################################################
output "ec2_public_ip" {
  value = aws_instance.Server.public_ip
}

output "amplify_branch_url" {
  value = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.this.default_domain}"
}



