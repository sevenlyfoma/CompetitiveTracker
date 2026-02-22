# CompetitiveTracker
Application for storing and acessing data on players in competive games



# Quick API Test Commands
curl http://localhost:8080/users/all

curl --request DELETE http://localhost:8080/users/4

curl --header "Content-Type: application/json" --request POST --data '{"name":"john example","email":"john@example.com","pronouns":"he/him","rating":1000}' http://localhost:8080/users

curl --header "Content-Type: application/json" --request POST --data '{"name":"jane example","email":"jane@example.com","pronouns":"she/her","rating":1000}' http://localhost:8080/users

curl --header "Content-Type: application/json" --request PUT --data '{"name":"jane example","email":"jane@example.com","pronouns":"she/her they/them","rating":1000}' http://localhost:8080/users/5