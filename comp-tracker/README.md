Copied read me with reminders for what commands to run

    to run springboot 
    mvn spring-boot:run

    to run vite in dev mode
    npm run dev

    to build reat into static
    npm run build

    to load static copy /my-react-app/dist into target/classes and rename to public


    refer to this: https://www.geeksforgeeks.org/reactjs/how-to-setup-reactjs-with-vite/
    this: https://github.com/DeltaV93/react-and-spring-sm
    and this: https://vite.dev/guide/static-deploy


    source: https://www.baeldung.com/spring-boot-react-crud
    source: https://github.com/adverthaf/spring-boot-react-crud-revisited


    to test the api in cmd
    curl --location 'http://localhost:8080/clients' \ --header 'Content-Type: application/json' \ --data-raw '{"name": "testbane", "email": "testemail"}'


    curl --header "Content-Type: application/json" --request POST --data '{"name":"testbane","email":"testemail"}' http://localhost:8080/clients

    curl http://localhost:8080/clients/1