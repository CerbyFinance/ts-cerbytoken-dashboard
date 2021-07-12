eval `ssh-agent -s`
ssh-add ~/.ssh/sms_rsa

git pull

docker build . --tag=offchain-bot-storage
docker stack deploy --resolve-image=never -c ./stack.prod.yml offchain-bot-storage-stack
docker service update --force offchain-bot-storage-stack_storage
