variable "image_tag" {
  type    = string
  default = "latest"
}

variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}

variable "stage" {
  type        = string
  default     = "staging"
  description = "staging = serve only the v2 host; production = manage all hosts' DNS (cutover)"
}
