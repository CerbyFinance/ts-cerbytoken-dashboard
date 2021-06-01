export $(grep -v '^#' .env | xargs)
docker build . --tag=deft-bridge-validator-server
docker stack deploy  -c ./stack.prod.yml deft-bridge-validator
