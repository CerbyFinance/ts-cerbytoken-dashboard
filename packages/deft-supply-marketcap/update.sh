export $(grep -v '^#' .env | xargs)

eval `ssh-agent -s`
ssh-add ~/.ssh/sms_rsa

git pull

docker build . --tag=deft-supply-marketcap-server
docker service update --force deft-supply-marketcap_deft-supply-marketcap-server
