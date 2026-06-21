module "edge" {
  source = "git::ssh://git@github.com/muningis/garazas.git//terraform/modules/app-edge?ref=main"

  app_name      = local.app_name
  zone_name     = local.zone_name
  hosts         = local.hosts
  staging_hosts = local.staging_hosts
  stage         = var.stage
}

module "workload" {
  source = "git::ssh://git@github.com/muningis/garazas.git//terraform/modules/app-workload?ref=main"

  app_name        = local.app_name
  image           = local.image
  hosts           = local.hosts
  port            = local.port
  tls_secret_name = module.edge.tls_secret_name
}
