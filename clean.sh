docker compose down 
docker rmi competitivetracker-db:latest
docker rmi competitivetracker-server:latest

docker container list -a
docker image list -a
docker volume list