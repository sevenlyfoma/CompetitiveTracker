# CompetitiveTracker
Application for storing and acessing data on players in competive games



# Quick API Test Commands
curl http://localhost:8080/users/all

curl --request DELETE http://localhost:8080/users/4

curl --header "Content-Type: application/json" --request POST --data '{"name":"john example","email":"john@example.com","pronouns":"he/him","rating":1000}' http://localhost:8080/users

curl --header "Content-Type: application/json" --request POST --data '{"name":"jane example","email":"jane@example.com","pronouns":"she/her","rating":1000}' http://localhost:8080/users

curl --header "Content-Type: application/json" --request PUT --data '{"name":"jane e example","email":"jane@example.com","pronouns":"she/her they/them","rating":1000}' http://localhost:8080/users/11

curl http://localhost:8080/matches/all

curl -X POST http://localhost:8080/matches \
-H "Content-Type: application/json" \
-d '{
    "dateOfMatch": "2023-10-27T10:00:00",
    "user1": { "id": 1 },
    "user2": { "id": 2 },
    "winner": { "id": 1 },
    "user1RatingBefore": 1200,
    "user1RatingAfter": 1215,
    "user2RatingBefore": 1200,
    "user2RatingAfter": 1185
}'