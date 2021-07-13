eval `ssh-agent -s`
ssh-add ~/.ssh/sms_rsa

git pull

docker build . --tag=bot-sniper-server
docker stack deploy --resolve-image=never -c ./stack.lambo.yml bot-sniper-lambo-stack
docker service update --force bot-sniper-lambo-stack_lambo-sniper
