provider "aws" {
  region = "us-east-1"
}



variable "name" {
  type = string
}
variable "lambda_bucket" {
  type = string
}
variable "lambda_key" {
  type = string
}



resource "aws_iam_role" "lambda_role" {
  name = "${var.name}-lambda-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}
resource "aws_lambda_function" "lambda" {
  function_name = var.name
  handler = "exports.handler"
  role = aws_iam_role.lambda_role.arn
  runtime = "nodejs10.x"
  s3_bucket = var.lambda_bucket
  s3_key = var.lambda_key
}



output "invoke_arn" {
  value = aws_lambda_function.lambda.invoke_arn
}
output "func_name" {
  value = aws_lambda_function.lambda.function_name
}
