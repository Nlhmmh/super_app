help:
	@echo "make [command]"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-30s\033[0m %s\n", $$1, $$2}'

int: ## init
	npm install
	brew install openjdk@17

run: ## run
	npm start

a-deploy-local: ## Build and deploy Android app
	sh build-android.sh
  # eas build -p android --local --profile production