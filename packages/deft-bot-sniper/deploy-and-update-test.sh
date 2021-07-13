eval `ssh-agent -s`
ssh-add ~/.ssh/sms_rsa

git pull

docker build . --tag=bot-sniper-server
docker stack deploy --resolve-image=never -c ./stack.test.yml bot-sniper-test-stack
docker service update --force bot-sniper-test-stack_deft-sniper
