eval `ssh-agent -s`
ssh-add ~/.ssh/sms_rsa

git pull

docker build . --tag=bot-detector-server
docker stack deploy --resolve-image=never -c ./stack.lambo.yml bot-detector-lambo-stack
docker service update --force bot-detector-lambo-stack_lambo-detector
