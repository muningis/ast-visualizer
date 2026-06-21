.PHONY: help build push release deploy infra\:init infra\:plan infra\:apply infra\:deploy app\:init app\:plan app\:apply app\:deploy

-include .env
export

REGISTRY    := ghcr.io
IMAGE_NAME  := muningis/ast-visualizer
GARAZAS_DIR ?= $(realpath $(CURDIR)/../garazas)
export KUBECONFIG ?= $(GARAZAS_DIR)/kubeconfig
export KUBE_CONFIG_PATH ?= $(GARAZAS_DIR)/kubeconfig

IMAGE_TAG ?= $(shell git rev-parse --short HEAD)

TF_INFRA := terraform -chdir=.tf/infra
TF_APP   := terraform -chdir=.tf/app

help:
	@echo "Frequent app deploys (.tf/app — Deployment/Service/Gateway/VirtualService):"
	@echo "  make release         build + push + deploy app (full local flow)"
	@echo "  make deploy          app terraform only (alias for app:deploy)"
	@echo "  make app:plan        plan app workspace (IMAGE_TAG=$(IMAGE_TAG))"
	@echo "  make app:apply       apply the saved app plan"
	@echo ""
	@echo "Rare infra changes (.tf/infra — DNS/TLS/origin cert/tls secret):"
	@echo "  make infra:plan      plan infra workspace"
	@echo "  make infra:apply     apply the saved infra plan"
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

infra\:init:
	$(TF_INFRA) init

infra\:plan:
	$(TF_INFRA) init && $(TF_INFRA) plan -out=tfplan

infra\:apply:
	$(TF_INFRA) apply tfplan

infra\:deploy:
	$(MAKE) infra:plan infra:apply

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
