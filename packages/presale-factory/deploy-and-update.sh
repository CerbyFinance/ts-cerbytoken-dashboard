eval `ssh-agent -s`
ssh-add ~/.ssh/sms_rsa

git pull

docker build . --tag=presale-factory-server
docker stack deploy --resolve-image=never -c ./stack.prod.yml presale-factory-stack
docker service update --force presale-factory-stack_presale-factory-server
