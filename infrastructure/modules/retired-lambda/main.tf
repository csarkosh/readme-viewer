provider "aws" {
  region = "us-east-1"
}

variable "function_name" {}

resource "aws_iam_role" "iam_for_lambda" {
  name = "${var.function_name}_role"
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
    },
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "edgelambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }

  ]
}
EOF
}

resource "aws_lambda_function" "function" {
  function_name = "${var.function_name}"
  handler = "exports.handler"
  role = "${aws_iam_role.iam_for_lambda.arn}"
  runtime = "nodejs10.x"
  source_code_hash = "${md5(file("inject-headers.zip"))}"
  filename = "inject-headers.zip"
  publish = true
  depends_on = ["aws_iam_role_policy_attachment.lambda_logs", "aws_cloudwatch_log_group.log_group"]
}

resource "aws_cloudwatch_log_group" "log_group" {
  name = "lambda_logging"
  retention_in_days = 14
}

resource "aws_iam_policy" "lambda_logging" {
  name = "lambda_logging"
  path = "/"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role = "${aws_iam_role.iam_for_lambda.name}"
  policy_arn = "${aws_iam_policy.lambda_logging.arn}"
}

output "qualified_arn" {
  value = "${aws_lambda_function.function.qualified_arn}"
}
