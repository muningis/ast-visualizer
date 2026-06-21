locals {
  app_name  = "ast-visualizer"
  zone_name = "astvisualizer.dev"

  # All hosts the cert + gateway serve; v2 is the staging host served now, apex
  # + www flip to the cluster on cutover (stage=production).
  hosts         = ["v2.astvisualizer.dev", "astvisualizer.dev", "www.astvisualizer.dev"]
  staging_hosts = ["v2.astvisualizer.dev"]

  port  = 3001 # server.ts defaults to 3001
  image = "ghcr.io/muningis/ast-visualizer:${var.image_tag}"
}
