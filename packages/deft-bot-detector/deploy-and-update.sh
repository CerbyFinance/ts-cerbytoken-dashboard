eval `ssh-agent -s`
ssh-add ~/.ssh/sms_rsa

git pull

docker build . --tag=bot-detector-server
docker stack deploy --resolve-image=never -c ./stack.prod.yml  --prune bot-detector-stack
# docker service update --force bot-detector-stack_deft-detector
# docker service update --force bot-detector-stack_deft-detector-binance
