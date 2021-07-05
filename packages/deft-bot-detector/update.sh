export $(grep -v '^#' .env | xargs)

eval `ssh-agent -s`
ssh-add ~/.ssh/sms_rsa

git pull

docker build . --tag=deft-bot-detector-server
docker service update --force deft-bot-detector_deft-bot-detector-server
