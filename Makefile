.DEFAULT_GOAL=start-server

clean-deps:
	@{ \
	if [ -d "./website/node_modules" ]; then \
		rm -r website/node_modules; \
	fi; \
	}

install-deps:
	@{ \
	cd website; \
	npm install --allow-root; \
	}

start-server:
	@{ \
	if [ -d "./website/node_modules" ]; then \
		cd website; \
		npm start; \
	else \
		echo "Dependencies are missing - please run 'make install-deps' first"; \
	fi; \
	}

build-and-deploy:
ifndef GIT_USER
	$(error GIT_USER is undefined)
endif
	@{ \
	status=$$(git status --porcelain); \
	if test "x$${status}" = x; then \
		cd website; \
		GIT_USER=${GIT_USER} CURRENT_BRANCH=development USE_SSH=true npm run publish-gh-pages; \
	else \
		echo "Please commit or stash your unstaged changes!\n$${status}"; \
	fi; \
	}
