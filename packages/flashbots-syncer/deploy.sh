export $(grep -v '^#' .env | xargs)
docker build . --tag=flasbots-syncer-server
docker stack deploy  -c ./stack.prod.yml flasbots-syncer
