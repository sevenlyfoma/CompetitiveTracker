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

/**
 * @param {Object} props
 * @param {number} props.userID - the uniquely identifing id of the user to be deleted
 * @param {Function} props.onDelete - Callback function executed after a successful deletion.
 * @returns {JSX.Element} The rendered delete button. 
*/
function UserDeleteButton({userID, onDelete}) {

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/users/${userID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      console.log(`User ${userID} deleted successfully`);
      // Trigger update for fetched user list
      onDelete();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  
  return (
    <>
      <button onClick={handleDelete} style={{ color: 'red' }}>
        Delete User
      </button>
    </>
  )
}

function UserList() {
  const [userList, setUserList] = useState([]);


  const fetchUsers = async () => {
    try {
      const response = await fetch("/users/all");
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      const userListJson = await response.json();
      setUserList(userListJson);

    } catch (error) {
      console.error('Error fetching data:', error);
      setUserList([]); 
    }
  
  };

  useEffect(() => {
    fetchUsers();
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
            <th></th>
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
              <td><UserDeleteButton userID={user.id} onDelete={fetchUsers}/></td>
            </tr>
          ))}
        </tbody>

      </table>
    
    </>
  )
 
}

export default App
