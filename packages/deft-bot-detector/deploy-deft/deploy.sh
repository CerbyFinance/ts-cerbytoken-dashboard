export $(grep -v '^#' .env | xargs)
docker build . --tag=deft-bot-detector-server
docker stack deploy  -c ./stack.prod.yml deft-bot-detector