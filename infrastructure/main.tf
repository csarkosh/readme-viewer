terraform {
  backend "s3" {
    bucket = "sh.csarko.terraform"
    key = "csarko.sh/terraform.tfstate"
    region = "us-west-2"
  }
}

provider "aws" {
  region = "us-west-2"
}

locals {
  domain_name = "readme-viewer.csarko.sh"
}

module "certificate" {
  source = "./modules/certificate"
}

// Network
resource "aws_route53_zone" "csarko" {
  name = "csarko.sh."
}
resource "aws_route53_record" "mx" {
  name = ""
  records = [
    "1 ASPMX.L.GOOGLE.COM",
    "5 ALT1.ASPMX.L.GOOGLE.COM",
    "5 ALT2.ASPMX.L.GOOGLE.COM",
    "10 ALT3.ASPMX.L.GOOGLE.COM",
    "10 ALT4.ASPMX.L.GOOGLE.COM"
  ]
  ttl = "3600"
  type = "MX"
  zone_id = aws_route53_zone.csarko.zone_id
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
}
module "new_lambda_server" {
  source = "./modules/lambda"
  lambda_key = "server.zip"
  name = "readme-viewer"
  lambda_bucket = "${local.domain_name}-lambdas2"
}
module "new_lambda_site" {
  source = "./modules/cloudfront-gateway-s3"
  name = "readme-viewer"
  domain_name = local.domain_name
  domain_cert_arn = module.certificate.acm_cert_arn
  lambda_invoke_arn = module.new_lambda_server.invoke_arn
  lambda_func_name = module.new_lambda_server.func_name
  asset_domain_name = aws_s3_bucket.new-website.bucket_regional_domain_name
  asset_origin_id = aws_s3_bucket.new-website.id
}



// Cache GitHub data cron
module "gh_cron" {
  source = "./modules/scheduled-lambda"
  s3_bucket = "readme-viewer.csarko.sh-lambdas2"
  s3_key = "cache-gh-data.zip"
  schedule_expression = "rate(1 hour)"
  name = "cache-gh-data"
}



// Web asset storage
resource "aws_s3_bucket" "website" {
  bucket = "csarko.sh"
  acl = "public-read"
  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = [
      "https://csarko.sh",
      "https://*.csarko.sh"
    ]
  }
  policy = <<POLICY
{
  "Version":"2012-10-17",
  "Statement":[{
    "Sid":"PublicReadGetObject",
    "Effect":"Allow",
    "Principal": "*",
    "Action":["s3:GetObject"],
    "Resource":["arn:aws:s3:::csarko.sh/*"]
  }]
}
  POLICY
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "aws_route53_record" "dns_record" {
  name = local.domain_name
  type = "A"
  zone_id = aws_route53_zone.csarko.zone_id
  alias {
    evaluate_target_health = true
    name = module.new_lambda_site.regional_domain_name
    zone_id = module.new_lambda_site.regional_zone_id
  }
}

resource "aws_s3_bucket" "new-website" {
  bucket = "readme-viewer.csarko.sh"
  acl = "public-read"
  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = [
      "https://csarko.sh",
      "https://*.csarko.sh"
    ]
  }
  policy = <<POLICY
{
  "Version":"2012-10-17",
  "Statement":[{
    "Sid":"PublicReadGetObject",
    "Effect":"Allow",
    "Principal": "*",
    "Action":["s3:GetObject"],
    "Resource":["arn:aws:s3:::${local.domain_name}/*"]
  }]
}
  POLICY
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}
