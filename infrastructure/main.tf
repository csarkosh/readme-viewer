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

module "certificate" {
  source = "modules/certificate"
}

// Hosted zone for dns
resource "aws_route53_zone" "csarko" {
  name = "csarko.sh."
}

// Apex record
resource "aws_route53_record" "root" {
  name = "${aws_route53_zone.csarko.name}"
  type = "A"
  zone_id = "${aws_route53_zone.csarko.zone_id}"

  alias {
    evaluate_target_health = false
    name = "${aws_cloudfront_distribution.website-distro.domain_name}"
    zone_id = "${aws_cloudfront_distribution.website-distro.hosted_zone_id}"
  }
}


// MX records
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
  zone_id = "${aws_route53_zone.csarko.zone_id}"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
}

resource "aws_s3_bucket" "website" {
  bucket = "csarko.sh"
  acl = "public-read"
  policy = <<POLICY
{
  "Version":"2012-10-17",
  "Statement":[{
    "Sid":"PublicReadGetObject",
    "Effect":"Allow",
    "Principal": "*",
    "Action":["s3:GetObject"],
    "Resource":["arn:aws:s3:::csarko.sh/*"
    ]
  }
  ]
}
  POLICY
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "aws_cloudfront_distribution" "website-distro" {
  aliases = ["csarko.sh"]

  "default_cache_behavior" {
    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    "forwarded_values" {
      "cookies" {
        forward = "none"
      }
      query_string = false
    }
    target_origin_id = "S3-csarko.sh"
    viewer_protocol_policy = "allow-all"
  }

  default_root_object = "index.html"
  enabled = true
  is_ipv6_enabled = true

  "origin" {
    domain_name = "${aws_s3_bucket.website.bucket_regional_domain_name}"
    origin_id = "S3-csarko.sh"
  }

  "ordered_cache_behavior" {
    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    "forwarded_values" {
      cookies {
        forward = "none"
      }
      query_string = false
    }
    path_pattern = "*"
    target_origin_id = "S3-csarko.sh"
    viewer_protocol_policy = "redirect-to-https"
  }

  "restrictions" {
    "geo_restriction" {
      restriction_type = "none"
    }
  }

  "viewer_certificate" {
    acm_certificate_arn = "${module.certificate.acm_cert_arn}"
    ssl_support_method = "sni-only"
  }
}
