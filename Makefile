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
	npm install; \
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
