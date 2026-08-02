module "edge" {
  source = "git::ssh://git@github.com/muningis/garazas.git//terraform/modules/app-edge?ref=v2"

  app_name      = local.app_name
  zone_name     = local.zone_name
  hosts         = local.hosts
  staging_hosts = local.staging_hosts
  stage         = var.stage
}

module "workload" {
  source = "git::ssh://git@github.com/muningis/garazas.git//terraform/modules/app-workload?ref=v2"

  app_name        = local.app_name
  image           = local.image
  hosts           = local.hosts
  port            = local.port
  tls_secret_name = module.edge.tls_secret_name
  ship_logs       = true
  cpu_request     = "25m"
  cpu_limit       = "200m"
  memory_request  = "96Mi"
  memory_limit    = "256Mi"
}

module "alerting" {
  source = "git::ssh://git@github.com/muningis/garazas.git//terraform/modules/app-alerting?ref=v2"

  app_name = local.app_name
  # TODO: set alert_channel_id to this app's own Discord channel id.
}
