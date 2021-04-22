# If you see pwd_unknown showing up check permissions
PWD ?= pwd_unknown
# PROJECT_NAME defaults to name of the current directory.
PROJECT_NAME							:= $(notdir $(PWD))
export PROJECT_NAME

# DATABASE DEPLOY FOLDER CONFIG - default ./data
ifeq ($(data),)
DATA := data
export DATA
else
DATA := $(data)
export DATA
endif

.PHONY: help
help:
	@echo ''
	@echo ''
	@echo '	Usage: make [COMMAND]'
	@echo ''
	@echo '		make all		# build init mempool and electrs'
	@echo '		make init		# setup some useful configs'
	@echo '		make mempool		# build q dockerized mempool.space'
	@echo '		make electrs		# build a docker electrs image'
	@echo ''

.PHONY: init
init:
	@echo ''
	mkdir -p   $(DATA) $(DATA)/mysql $(DATA)/mysql/db-scripts $(DATA)/mysql/data 
	install -v mariadb-structure.sql $(DATA)/mysql/db-scripts
	#REF: https://github.com/mempool/mempool/blob/master/docker/README.md
	cat docker/docker-compose.yml > docker-compose.yml
	cat backend/mempool-config.sample.json > backend/mempool-config.json
.PHONY: mempool
mempool: init
	@echo ''
	docker-compose up
	@echo ''
.PHONY: electrum
electrum:
	#REF: https://hub.docker.com/r/beli/electrum
	@echo ''
	docker build -f docker/electrum/Dockerfile -t mempool/electrum .
	@echo ''
.PHONY: all
all: init
	make mempool
#######################
#######################
.PHONY: clean
clean:
	# remove created images
	@docker-compose -p $(PROJECT_NAME)_$(HOST_UID) down --remove-orphans --rmi all 2>/dev/null \
	&& echo 'Image(s) for "$(PROJECT_NAME):$(HOST_USER)" removed.' \
	|| echo 'Image(s) for "$(PROJECT_NAME):$(HOST_USER)" already removed.'
#######################
.PHONY: prune
prune:
	@echo 'prune'
	docker-compose -p $(PROJECT_NAME)_$(HOST_UID) down
	docker system prune -af
#######################
.PHONY: prune-network
prune-network:
	@echo 'prune-network'
	docker-compose -p $(PROJECT_NAME)_$(HOST_UID) down
	docker network prune -f
#######################

-include Makefile
