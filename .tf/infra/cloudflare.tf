data "cloudflare_zone" "this" {
  filter = {
    name = local.zone_name
  }
}

# Only the new v2.* CNAME is managed here (old hosts stay on the legacy VPS).
resource "cloudflare_dns_record" "app" {
  for_each = toset(local.dns_hosts)

  zone_id = data.cloudflare_zone.this.id
  name    = each.value
  type    = "CNAME"
  content = local.ingress_hostname
  proxied = true
  ttl     = 1
}

resource "tls_private_key" "origin" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "tls_cert_request" "origin" {
  private_key_pem = tls_private_key.origin.private_key_pem

  subject {
    common_name = local.cert_common_name
  }

  dns_names = local.hosts
}

resource "cloudflare_origin_ca_certificate" "app" {
  # sort() to match the order Cloudflare returns (alphabetical); otherwise the
  # list-order mismatch forces a perpetual replace on every plan.
  hostnames          = sort(local.hosts)
  request_type       = "origin-rsa"
  requested_validity = 5475

  csr = tls_cert_request.origin.cert_request_pem
}
