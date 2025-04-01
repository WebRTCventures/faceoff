variable "region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"  # Changed from us-west-2
}

variable "az1" {
  description = "First availability zone"
  type        = string
  default     = "us-east-1a"  # Changed from us-west-2a
}

variable "az2" {
  description = "Second availability zone"
  type        = string
  default     = "us-east-1b"  # Changed from us-west-2b
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}
