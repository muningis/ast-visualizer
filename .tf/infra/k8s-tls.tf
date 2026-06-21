# The origin-cert TLS secret consumed by the app's Istio Gateway
# (gateway lives in the app workspace and references this by name only).
resource "kubernetes_secret" "tls" {
  metadata {
    name      = "${local.app_name}-origin-cert"
    namespace = "istio-system"
  }

  type = "kubernetes.io/tls"

  data = {
    "tls.crt" = cloudflare_origin_ca_certificate.app.certificate
    "tls.key" = tls_private_key.origin.private_key_pem
  }
}
