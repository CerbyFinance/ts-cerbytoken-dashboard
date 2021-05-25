export $(grep -v '^#' .env | xargs)
docker build . --tag=deft-supply-marketcap-server
docker stack deploy  -c ./stack.prod.yml deft-supply-marketcap
