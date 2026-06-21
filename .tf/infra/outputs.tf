# For human cross-reference only — NOT consumed via remote_state.
# The app workspace recomputes these deterministically from app_name.
output "tls_secret_name" {
  value = kubernetes_secret.tls.metadata[0].name
}
