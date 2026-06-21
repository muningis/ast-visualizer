.PHONY: help build push release deploy app\:init app\:plan app\:apply app\:deploy

-include .env
export

REGISTRY    := ghcr.io
IMAGE_NAME  := muningis/ast-visualizer
GARAZAS_DIR ?= $(realpath $(CURDIR)/../garazas)
export KUBECONFIG ?= $(GARAZAS_DIR)/kubeconfig
export KUBE_CONFIG_PATH ?= $(GARAZAS_DIR)/kubeconfig

IMAGE_TAG ?= $(shell git rev-parse --short HEAD)

TF_APP := terraform -chdir=.tf/app

help:
	@echo "Single-stage app (.tf/app — edge + workload modules):"
	@echo "  make release         build + push + deploy (full local flow)"
	@echo "  make deploy          terraform apply only (alias for app:deploy)"
	@echo "  make app:plan        plan (IMAGE_TAG=$(IMAGE_TAG))"
	@echo "  make app:apply       apply the saved plan"
	@echo ""
	@echo "Cutover: set stage=production in .tf/app/variables.tf (or -var) then apply."
	@echo ""
	@echo "IMAGE_TAG:   $(IMAGE_TAG)"
	@echo "KUBECONFIG:  $(KUBECONFIG)"

build:
	docker build --platform linux/amd64 \
		-t $(REGISTRY)/$(IMAGE_NAME):$(IMAGE_TAG) \
		-t $(REGISTRY)/$(IMAGE_NAME):latest \
		.

push:
	@echo "$(GITHUB_TOKEN)" | docker login $(REGISTRY) -u $(GITHUB_USER) --password-stdin
	docker push $(REGISTRY)/$(IMAGE_NAME):$(IMAGE_TAG)
	docker push $(REGISTRY)/$(IMAGE_NAME):latest

app\:init:
	$(TF_APP) init

app\:plan:
	$(TF_APP) init && $(TF_APP) plan -var="image_tag=$(IMAGE_TAG)" -out=tfplan

app\:apply:
	$(TF_APP) apply tfplan

app\:deploy:
	$(MAKE) app:plan app:apply

deploy:
	$(MAKE) app:deploy

release:
	$(MAKE) build push deploy
