output "rds_endpoint" {
  description = "The connection endpoint for the RDS instance"
  value       = aws_db_instance.travel_planner.endpoint
}

output "rds_port" {
  description = "The port the RDS instance is listening on"
  value       = aws_db_instance.travel_planner.port
}

output "db_name" {
  description = "The name of the database"
  value       = aws_db_instance.travel_planner.db_name
}

output "cognito_user_pool_id" {
  description = "The ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_client_id" {
  description = "The ID of the Cognito User Pool Client"
  value       = aws_cognito_user_pool_client.client.id
}

output "cognito_endpoint" {
  description = "The endpoint of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.endpoint
}