provider "aws" {
  region = "us-west-2"
}

variable "website_domain" {
  type = "string"
}

variable "hosted_zone_id" {
  description = "The Route53 hosted zone ID"
  type = "string"
}

resource "aws_route53_record" "dns_record" {
  name = "${var.website_domain}"
  type = "A"
  zone_id = "${var.hosted_zone_id}"

  alias {
    evaluate_target_health = false
    name = "${aws_s3_bucket.website.website_domain}"
    zone_id = "${aws_s3_bucket.website.hosted_zone_id}"
  }
}

resource "aws_s3_bucket" "website" {
  bucket = "${var.website_domain}"
  acl = "public-read"
  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = [
      "https://${var.website_domain}",
      "https://*.${var.website_domain}"
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
    "Resource":[
      "arn:aws:s3:::${var.website_domain}/*"
    ]
  }]
}
  POLICY
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

output "endpoint" {
  value = "${aws_s3_bucket.website.website_endpoint}"
}
