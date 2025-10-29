variable "db_username" {
  description = "Database administrator username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database administrator password"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Environment (dev/prod)"
  type        = string
  default     = "dev"
}
variable "aws_access_key" {
  description = "aws_access_key"
  type        = string
  default     = ""
}

variable "aws_secret_key" {
  description = "aws_secret_key"
  type        = string
  default     = ""
}

variable "aws_session_token" {
  description = "aws_session_token"
  type        = string
  default     = ""
}