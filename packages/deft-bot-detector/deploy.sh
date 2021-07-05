export $(grep -v '^#' .env | xargs)
docker build . --tag=bot-detector-server
docker stack deploy  -c ./stack.prod.yml bot-detector-stack