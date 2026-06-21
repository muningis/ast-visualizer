terraform {
  backend "s3" {
    bucket = "garazas-terraform-state"
    key    = "apps/ast-visualizer/app.tfstate"

    endpoint = "https://nbg1.your-objectstorage.com"
    region   = "nbg1"

    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    force_path_style            = true
  }
}
