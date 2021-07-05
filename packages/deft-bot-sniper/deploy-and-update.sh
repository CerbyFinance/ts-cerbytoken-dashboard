eval `ssh-agent -s`
ssh-add ~/.ssh/sms_rsa

git pull

docker build . --tag=bot-sniper-server
docker stack deploy --resolve-image=never -c ./stack.prod.yml bot-sniper-stack
docker service update --force bot-sniper-stack_deft-sniper
