import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
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
      console.log(userListJson);
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
          <CreateUserRow onCreate={fetchUsers}/>
        </tbody>

      </table>
    
    </>
  )
 
}

function CreateUserButton({ userData, onCreate }) {
  const handleCreate = async () => {
    if (!window.confirm("Are you sure the users data is correct")) return;

    try {
      const response = await fetch(`/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      onCreate();
      console.log(`User created uccessfully`);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  
  return (
    <>
      <button onClick={handleCreate} style={{ color: 'green' }}>
        Create User
      </button>
    </>
  )
}

function CreateUserRow( {onCreate} ) {
  const [user, setUser] = useState({name: "", email: "", pronouns: "", rating: ""});

  useEffect(() => {
  console.log("Updated User State:", user);
  }, [user]);

  function handleChange(e) {
    const { name, value, type } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      // [name]: value,
      [name]: type === 'number' ? Number(value) : value,
    }));
  }

  return <tr>
      <td>

      </td>

      <td>
        <input type="text" name="name" value={user.name} onChange={handleChange}/> 
      </td>

      <td>
        <input type="text" name="email" value={user.email} onChange={handleChange}/> 
      </td>

      <td>
        <input type="text" name="pronouns" value={user.pronouns} onChange={handleChange}/> 
      </td>

      <td>
        <input type="number" name="rating" value={user.rating} onChange={handleChange}/> 
      </td>

      <td>
         <CreateUserButton userData={user} onCreate={onCreate}/>
      </td>
    </tr>
  
}

export default App
