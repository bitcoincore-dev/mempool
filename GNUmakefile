# If you see pwd_unknown showing up check permissions
PWD ?= pwd_unknown

# DATABASE DEPLOY FOLDER CONFIG - default ./data
ifeq ($(data),)
DATA := data
export DATA
else
DATA := $(data)
export DATA
endif

help:
	@echo ''
	@echo ''
	@echo '	Usage: make [COMMAND]'
	@echo ''
	@echo '		make all		#build init mempool and electrs'
	@echo '		make init		#setup some useful configs'
	@echo '		make mempool		#build q dockerized mempool.space'
	@echo '		make electrs		#build a dockerized electrs service'
	@echo ''

.PHONY: all
all:
	make init
	make mempool

.PHONY: init
init:
	@echo ''
	mkdir -p   $(DATA) $(DATA)/mysql $(DATA)/mysql/db-scripts $(DATA)/mysql/data 
	install -v mariadb-structure.sql $(DATA)/mysql/db-scripts
	#REF: https://github.com/mempool/mempool/blob/master/docker/README.md
	cat docker/docker-compose.yml > docker-compose.yml
.PHONY: mempool
mempool: init
	@echo ''
	docker-compose up --force-recreate --always-recreate-deps
	@echo ''
.PHONY: electrs
electrs:
	#REF: https://github.com/romanz/electrs/blob/master/doc/usage.md
	#REF: https://github.com/getumbrel/docker-electrs/blob/master/Dockerfile
	@echo ''
	docker build -f docker/electrs/Dockerfile .
	@echo ''
#######################
-include Makefile
