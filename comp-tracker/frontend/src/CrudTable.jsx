import { useState, useEffect } from 'react'
import './UserList.css'
import { useNavigate } from 'react-router-dom';


function CrudTable({data_name}) {
    const [dataList, setDataList] = useState([]);
    const [keyNames, setKeyNames] = useState([]);
    

    const [editingId, setEditingId] = useState(null);
    const handleEditSelect = (id) => { setEditingId(id); };
    const handleEditCancel = () => { setEditingId(null); };

    // console.log(data_name)

    const fetchData = async () => {
        try {
        const response = await fetch("/api/" + data_name + "/all");
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        const dataListJson = await response.json();
        console.log(dataListJson);

        setDataList(dataListJson);
        
        if (dataListJson.length > 0) {
            setKeyNames(Object.keys(dataListJson.at(0)));
        }
        

        } catch (error) {
        console.error('Error fetching data:', error);
        // setDataList([]); 
        }
    };


    useEffect(() => {
        fetchData();
    }, [data_name]);

    // useEffect(() => {
    // const interval = setInterval(() => {
    //     console.log("Current dataList:", dataList);
    // }, 1000);

    // return () => clearInterval(interval);
    // }, [dataList]);



    return (
        <>
        <h2>{data_name} list</h2>
        
        <table>
            <thead>
            <tr>
                <th></th>
                {keyNames.map((value, index) => (
                    <th key={index}>
                    {typeof value === 'object' ? JSON.stringify(value) : value}
                    </th>
                ))}
                <th></th>
                <th></th>
            </tr>
            </thead>
            <tbody>
                {dataList
                    .slice() 
                    .sort((a, b) => a.id - b.id)
                    .map((item) => {
                        if (false) {
                        return (
                            <></>
                        )
                        }
                        else{
                        return (
                            <StandardDataRow key={item.id} item={item} />
                        )
                        }
                    })}


            </tbody>

        </table>
        
        </>
    )
}

function StandardDataRow({ item }) {
    const cellData = Object.values(item);

    return (
       <tr>
             <td></td>
             {cellData.map((value, index) => (
                 <td key={index}>
                 {typeof value === 'object' ? JSON.stringify(value) : value}
                 </td>
             ))}
             <td></td>
             <td></td>
         </tr>
    )
}



// function StandardDataRow({ item }) {
//     console.log(item)
//     const cellData = Object.values(item);

//     return (
//         <tr>
//             <td></td>
//             {cellData.map((value, index) => (
//                 <td key={index}>
//                 {typeof value === 'object' ? JSON.stringify(value) : value}
//                 </td>
//             ))}
//             <td></td>
//             <td></td>
//         </tr>
//     )
// }

//  {/* {userList
//             .slice() 
//             .sort((a, b) => a.id - b.id)
//             .map((user) => {
//                 if (editingId === user.id) {
//                 return (
//                     <UpdateUserRow key={user.id} user_data={user} onUpdate={fetchUsers} handleCancel={handleCancel}/>
//                 )
//                 }
//                 else{
//                 return (
//                     <StandardUserRow key={user.id} user={user} handleEditClick={handleEditClick} fetchUsers={fetchUsers}/>
//                 )
//                 }
//             })}
//             <CreateUserRow key={"Create User Row"} onCreate={fetchUsers}/> */}


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
      const response = await fetch(`/api/users/${userID}`, {
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

// function StandardUserRow({ user }) {
//   // Object.values returns an array of the values: [1, "John", "john@email.com", 5]
//   const cellData = Object.values(user); //for keys Object.keys(user)

//   return (
//     <tr>
//       {cellData.map((value, index) => (
//         <td key={index}>
//           {/* Ensure value is something React can render (string/number) */}
//           {typeof value === 'object' ? JSON.stringify(value) : value}
//         </td>
//       ))}
//     </tr>
//   );
// }

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
      const response = await fetch(`/api/users`, {
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
      const response = await fetch(`/api/users/${userData.id}`, {
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

export default CrudTable
