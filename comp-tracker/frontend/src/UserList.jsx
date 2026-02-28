import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './UserList.css'
import { useNavigate } from 'react-router-dom';

import UserMatchList from './UserMatchList'

function UserList() {
  const [userList, setUserList] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const handleEditClick = (id) => {
    setEditingId(id);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  useEffect(() => {
  console.log("Updated Editing ID State:", editingId);
  }, [editingId]);

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

  let usermatchcontent = <></>;

  return (
    <>
      <h2>User List</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Pronouns</th>
            <th>Rating</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {userList
          .slice() 
          .sort((a, b) => a.id - b.id)
          .map((user) => {
            if (editingId === user.id) {
              return (
                <UpdateUserRow key={user.id} user_data={user} onUpdate={fetchUsers} handleCancel={handleCancel}/>
              )
            }
            else{
              return (
                <StandardUserRow key={user.id} user={user} handleEditClick={handleEditClick} fetchUsers={fetchUsers}/>
              )
            }
          })}
          <CreateUserRow key={"Create User Row"} onCreate={fetchUsers}/>
        </tbody>

      </table>
    
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
      <button className='ChangeButton' onClick={handleDelete} style={{ color: 'red' }}>
        Delete User
      </button>
    </>
  )
}

function EditUserButton({userID, handleEditClick}){
  
  return (
  
    <button className='EditButton' onClick={() => {handleEditClick(userID)}} style={{ color: 'blue' }}>
      Edit
    </button>
  )
}

function StopEditUserButton({handleCancel}){
   return (
  
    <button className='EditButton' onClick={handleCancel} style={{ color: 'blue' }}>
      Cancel
    </button>
  )
}

function StandardUserRow({user, handleEditClick, fetchUsers}) {
  const navigate = useNavigate();
  return (
    <tr>
      <td><EditUserButton userID={user.id} handleEditClick={handleEditClick}/></td>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.pronouns}</td>
      <td>{user.rating}</td>
      <td><UserDeleteButton userID={user.id} onDelete={fetchUsers}/></td>
      <td><button onClick={() => navigate(`/userpages/${user.id}`)}>View User</button></td>
    </tr>
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
      <td></td>
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
         <CreateUserButton userData={user} onCreate={onCreate} setUser={setUser}/>
      </td>

      <td></td>
    </tr>
  
}

function CreateUserButton({ userData, onCreate, setUser }) {
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
      setUser({name: "", email: "", pronouns: "", rating: ""});
      console.log(`User created uccessfully`);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  
  return (
    <>
      <button className='ChangeButton' onClick={handleCreate} style={{ color: 'green' }}>
        Create User
      </button>
    </>
  )
}

function UpdateUserRow( {user_data, onUpdate, handleCancel} ) {
  const [user, setUser] = useState(user_data);

  // useEffect(() => {
  // console.log("Updated User State:", user);
  // }, [user]);

  function handleChange(e) {
    const { name, value, type } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      // [name]: value,
      [name]: type === 'number' ? Number(value) : value,
    }));
  }

  const combinedOnUpdate = () => {
    onUpdate();
    handleCancel();
  }

  return <tr>
      <td><StopEditUserButton handleCancel={handleCancel}/></td>
      
      <td>{user.id}</td>

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
         <UpdateUserButton userData={user} onUpdate={combinedOnUpdate}/>
      </td>

      <td></td>
    </tr>
  
}

function UpdateUserButton({ userData, onUpdate }) {
  const handleUpdate = async () => {
    if (!window.confirm("Are you sure the users data is correct")) return;

    console.log(userData.id)
    try {
      const response = await fetch(`/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      onUpdate();
      console.log(`User updated successfully`);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  
  return (
    <>
      <button className='ChangeButton' onClick={handleUpdate} style={{ color: 'blue' }}>
        Update User
      </button>
    </>
  )
}

export default UserList
