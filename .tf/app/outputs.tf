output "tls_secret_name" {
  value = module.edge.tls_secret_name
}

output "hosts" {
  value = local.hosts
}

output "url" {
  value = "https://${local.staging_hosts[0]}"
}
