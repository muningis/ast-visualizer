resource "kubernetes_manifest" "deployment" {
  manifest = {
    apiVersion = "apps/v1"
    kind       = "Deployment"
    metadata = {
      name      = local.app_name
      namespace = "apps"
    }
    spec = {
      replicas = 1
      selector = { matchLabels = { app = local.app_name } }
      template = {
        metadata = { labels = { app = local.app_name } }
        spec = {
          imagePullSecrets = [{ name = "ghcr-credentials" }]
          containers = [{
            name  = local.app_name
            image = local.image
            ports = [{ containerPort = local.port }]
            resources = {
              requests = { cpu = "10m", memory = "64Mi" }
              limits   = { cpu = "200m", memory = "256Mi" }
            }
          }]
        }
      }
    }
  }
}

resource "kubernetes_manifest" "service" {
  manifest = {
    apiVersion = "v1"
    kind       = "Service"
    metadata = {
      name      = local.app_name
      namespace = "apps"
    }
    spec = {
      selector = { app = local.app_name }
      ports    = [{ port = 80, targetPort = local.port }]
    }
  }
}

resource "kubernetes_manifest" "gateway" {
  manifest = {
    apiVersion = "networking.istio.io/v1beta1"
    kind       = "Gateway"
    metadata = {
      name      = "${local.app_name}-gateway"
      namespace = "istio-system"
    }
    spec = {
      selector = { istio = "ingressgateway" }
      servers = [
        {
          port  = { number = 443, name = "https", protocol = "HTTPS" }
          tls   = { mode = "SIMPLE", credentialName = local.tls_secret_name }
          hosts = local.hosts
        },
        {
          port  = { number = 80, name = "http", protocol = "HTTP" }
          tls   = { httpsRedirect = true }
          hosts = local.hosts
        },
      ]
    }
  }
}

resource "kubernetes_manifest" "virtualservice" {
  manifest = {
    apiVersion = "networking.istio.io/v1beta1"
    kind       = "VirtualService"
    metadata = {
      name      = local.app_name
      namespace = "apps"
    }
    spec = {
      hosts    = local.hosts
      gateways = ["istio-system/${local.app_name}-gateway"]
      http = [{
        route = [{
          destination = {
            host = "${local.app_name}.apps.svc.cluster.local"
            port = { number = 80 }
          }
        }]
      }]
    }
  }
}
