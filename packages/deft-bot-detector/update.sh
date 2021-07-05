export $(grep -v '^#' .env | xargs)

eval `ssh-agent -s`
ssh-add ~/.ssh/sms_rsa

git pull

docker build . --tag=bot-detector-server
docker stack deploy  -c ./stack.prod.yml bot-detector-stack