export $(grep -v '^#' .env | xargs)

eval `ssh-agent -s`
ssh-add ~/.ssh/sms_rsa

git pull

docker build . --tag=flasbots-syncer-server
docker service update --force flasbots-syncer_flasbots-syncer-server
