import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <UserList />
    </>
  )
}

function UserList() {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    fetch("/users/all")
      .then(response => {
        // Check if the status is in the 200-299 range
        if (!response.ok) {
          console.error("not ok")
          throw new Error(`Server responded with status: ${response.status}`);
        }
        return response.json()
      })
      .then(userListJson => {
        console.log(userListJson);
        setUserList(userListJson);

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setMessage([]);
      });
    }, []);

  return (
    <>
      <h2>User List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Pronouns</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.pronouns}</td>
              <td>{user.rating}</td>
            </tr>
          ))}
        </tbody>

      </table>
    
    </>
  )
 
}

export default App
