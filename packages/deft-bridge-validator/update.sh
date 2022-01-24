export $(grep -v '^#' .env | xargs)

eval `ssh-agent -s`
ssh-add ~/.ssh/sms_rsa

git pull

docker build . --tag=deft-bridge-validator-server
docker service update --force deft-bridge-validator_deft-bridge-validator-server --args "$*"
