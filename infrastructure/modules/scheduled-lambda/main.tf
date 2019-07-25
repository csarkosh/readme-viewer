provider "aws" {
  region = "us-east-1"
}


variable "name" {
  type = "string"
}
variable "s3_bucket" {
  type = "string"
}
variable "s3_key" {
  type = "string"
}
variable "schedule_expression" {
  type = "string"
}


resource "aws_iam_role_policy" "policy" {
  role = "${aws_iam_role.role.id}"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": "arn:aws:secretsmanager:us-east-1:*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::csarko.sh/*"
    }
  ]
}
EOF
}
resource "aws_iam_role" "role" {
  name = "${var.name}-lambda-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Sid": ""
    }
  ]
}
EOF
}
resource "aws_lambda_function" "func" {
  function_name = "${var.name}"
  handler = "exports.handler"
  role = "${aws_iam_role.role.arn}"
  runtime = "nodejs10.x"
  s3_bucket = "${var.s3_bucket}"
  s3_key = "${var.s3_key}"
}
resource "aws_cloudwatch_event_rule" "rule" {
  name = "${var.name}-event-rule"
  schedule_expression = "${var.schedule_expression}"
}
resource "aws_cloudwatch_event_target" "target" {
  arn = "${aws_lambda_function.func.arn}"
  rule = "${aws_cloudwatch_event_rule.rule.name}"
}
resource "aws_lambda_permission" "cloudwatch_lambda_perm" {
  statement_id = "AllowExecutionFromCloudWatch"
  principal = "events.amazonaws.com"
  action = "lambda:InvokeFunction"
  source_arn = "${aws_cloudwatch_event_rule.rule.arn}"
  function_name = "${aws_lambda_function.func.function_name}"
}
