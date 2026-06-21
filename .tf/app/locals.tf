locals {
  app_name = "ast-visualizer"
  hosts    = ["v2.astvisualizer.dev", "astvisualizer.dev", "www.astvisualizer.dev"] # gateway + virtualservice
  port     = 3001                                                                   # server.ts defaults to 3001
  image    = "ghcr.io/muningis/ast-visualizer:${var.image_tag}"

  # Deterministic name of the infra-owned origin-cert secret (see .tf/infra) —
  # recomputed here so the two states stay decoupled (no terraform_remote_state).
  tls_secret_name = "${local.app_name}-origin-cert"
}
