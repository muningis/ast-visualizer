locals {
  app_name = "ast-visualizer"

  # Cloudflare zone that owns the records.
  zone_name = "astvisualizer.dev"

  # All hostnames the gateway + origin cert serve. The old hosts are included so
  # a later DNS repoint flips them live with no further Terraform changes.
  hosts = ["v2.astvisualizer.dev", "astvisualizer.dev", "www.astvisualizer.dev"]

  # Only the NEW v2 record is managed here. The old apex/www records still point
  # at the legacy VPS and are left untouched until the manual cutover.
  dns_hosts = ["v2.astvisualizer.dev"]

  cert_common_name = "astvisualizer.dev"
  ingress_hostname = "ingress.raccooningis.dev"
}
