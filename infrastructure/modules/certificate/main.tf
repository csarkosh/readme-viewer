terraform {
  backend "s3" {
    bucket = "sh.csarko.terraform"
    key = "csarko.sh/terraform.tfstate"
    region = "us-west-2"
  }
}

provider "aws" {
  region = "us-east-1"
}

data "aws_acm_certificate" "cert" {
  domain = "csarko.sh"
  statuses = ["ISSUED"]
  most_recent = true
}

output "acm_cert_arn" {
  value = "${data.aws_acm_certificate.cert.arn}"
}
