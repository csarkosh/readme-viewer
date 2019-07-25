provider "aws" {
  region = "us-east-1"
}



variable "name" {
  type = "string"
}
variable "domain_name" {
  type = "string"
}
variable "domain_cert_arn" {
  type = "string"
}
variable "lambda_invoke_arn" {
  type = "string"
}
variable "lambda_func_name" {
  type = "string"
}
variable "asset_domain_name" {
  type = "string"
}
variable "asset_origin_id" {
  type = "string"
}



// Setup gateway resources
resource "aws_api_gateway_rest_api" "rest_api" {
  name = "${var.name}-gateway"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}
resource "aws_api_gateway_resource" "resource" {
  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  parent_id = "${aws_api_gateway_rest_api.rest_api.root_resource_id}"
  path_part = "{proxy+}"
}
resource "aws_api_gateway_method" "proxy" {
  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  resource_id = "${aws_api_gateway_resource.resource.id}"
  authorization = "NONE"
  http_method = "ANY"
}
resource "aws_api_gateway_method" "proxy_root" {
  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  resource_id = "${aws_api_gateway_rest_api.rest_api.root_resource_id}"
  authorization = "NONE"
  http_method = "ANY"
}
resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  stage_name = "${var.name}"
  depends_on = [
    "aws_api_gateway_integration.gateway_lambda_root",
    "aws_api_gateway_integration.gateway_lambda"
  ]
}
resource "aws_api_gateway_base_path_mapping" "mapping" {
  api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  domain_name = "${var.domain_name}"
  stage_name = "${aws_api_gateway_deployment.deployment.stage_name}"
}



// Setup gateway-retired-lambda integration
resource "aws_api_gateway_integration" "gateway_lambda" {
  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  resource_id = "${aws_api_gateway_method.proxy.resource_id}"
  http_method = "${aws_api_gateway_method.proxy.http_method}"
  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = "${var.lambda_invoke_arn}"
}
resource "aws_api_gateway_integration" "gateway_lambda_root" {
  rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
  resource_id = "${aws_api_gateway_method.proxy_root.resource_id}"
  http_method = "${aws_api_gateway_method.proxy_root.http_method}"
  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = "${var.lambda_invoke_arn}"
}
resource "aws_lambda_permission" "apigw_perm" {
  statement_id = "AllowAPIGatewayInvoke"
  action = "lambda:InvokeFunction"
  function_name = "${var.lambda_func_name}"
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.rest_api.execution_arn}/*/*"
}



// Setup gateway-route53 integration
resource "aws_api_gateway_domain_name" "domain_name" {
  domain_name = "${var.domain_name}"
  regional_certificate_arn = "${var.domain_cert_arn}"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}



// Setup cloudfront-gateway integration
resource "aws_cloudfront_distribution" "protocol_proxy" {
  aliases = ["${var.domain_name}"]
  enabled = true
  "restrictions" {
    "geo_restriction" {
      restriction_type = "none"
    }
  }
  "viewer_certificate" {
    acm_certificate_arn = "${var.domain_cert_arn}"
    ssl_support_method = "sni-only"
  }
  "origin" {
    domain_name = "${var.asset_domain_name}"
    origin_id = "${var.asset_origin_id}"
  }
  "origin" {
    domain_name = "${element(split("/", replace(aws_api_gateway_deployment.deployment.invoke_url, "https://", "")), 0)}"
    origin_id = "${aws_api_gateway_deployment.deployment.id}"
    origin_path = "/${aws_api_gateway_deployment.deployment.stage_name}"
    custom_origin_config {
      http_port = 80
      https_port = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols = ["SSLv3", "TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }
  ordered_cache_behavior {
    path_pattern = "/"
    allowed_methods = ["GET", "POST", "DELETE", "PUT", "HEAD", "PATCH", "OPTIONS"]
    cached_methods = ["GET", "HEAD"]
    "forwarded_values" {
      "cookies" {
        forward = "none"
      }
      headers = ["*"]
      query_string = true
    }
    max_ttl = 0
    min_ttl = 0
    target_origin_id = "${aws_api_gateway_deployment.deployment.id}"
    viewer_protocol_policy = "redirect-to-https"
  }
  ordered_cache_behavior {
    path_pattern = "/data/*"
    allowed_methods = ["GET", "POST", "DELETE", "PUT", "HEAD", "PATCH", "OPTIONS"]
    cached_methods = ["GET", "HEAD"]
    "forwarded_values" {
      "cookies" {
        forward = "none"
      }
      query_string = true
    }
    max_ttl = 0
    min_ttl = 0
    target_origin_id = "${var.asset_origin_id}"
    viewer_protocol_policy = "redirect-to-https"
  }
  ordered_cache_behavior {
    path_pattern = "/docs/*"
    allowed_methods = ["GET", "POST", "DELETE", "PUT", "HEAD", "PATCH", "OPTIONS"]
    cached_methods = ["GET", "HEAD"]
    "forwarded_values" {
      "cookies" {
        forward = "none"
      }
      query_string = true
    }
    max_ttl = 0
    min_ttl = 0
    target_origin_id = "${var.asset_origin_id}"
    viewer_protocol_policy = "redirect-to-https"
  }
  "default_cache_behavior" {
    allowed_methods = ["GET", "POST", "DELETE", "PUT", "HEAD", "PATCH", "OPTIONS"]
    cached_methods = ["GET", "HEAD"]
    "forwarded_values" {
      "cookies" {
        forward = "none"
      }
      query_string = false
    }
    target_origin_id = "${var.asset_origin_id}"
    viewer_protocol_policy = "redirect-to-https"
  }
}



output "invoke_url" {
  value = "${aws_api_gateway_deployment.deployment.invoke_url}"
}
output "domain_name" {
  value = "${aws_api_gateway_domain_name.domain_name.domain_name}"
}
output "regional_domain_name" {
  value = "${aws_cloudfront_distribution.protocol_proxy.domain_name}"
}
output "regional_zone_id" {
  value = "${aws_cloudfront_distribution.protocol_proxy.hosted_zone_id}"
}

