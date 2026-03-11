import { useState, useEffect } from 'react'
import './UserList.css'
import { useNavigate } from 'react-router-dom';

function TournamentList() {
  const [dataList, setDataList] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const handleEditClick = (id) => { setEditingId(id); };
  const handleCancel = () => { setEditingId(null);};

  useEffect(() => { console.log("Updated Editing ID State:", editingId); }, [editingId]);

  const fetchTournaments = async () => {
    try {
      const response = await fetch("/api/tournaments/all");
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      const dataListJson = await response.json();
      console.log(dataListJson);
      setDataList(dataListJson);

    } catch (error) {
      console.error('Error fetching data:', error);
      setDataList([]); 
    }
  
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  return (
    <>
      <h2>Tournament List</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dataList
          .slice() 
          .sort((a, b) => a.id - b.id)
          .map((item) => {
            if (editingId === item.id) {
              return (
                <UpdateItemRow key={item.id} item_data={item} onUpdate={fetchTournaments} handleCancel={handleCancel}/>
              )
            }
            else{
              return (
                <StandardItemRow key={item.id} item={item} handleEditClick={handleEditClick} fetchItems={fetchTournaments}/>
              )
            }
          })}
          <CreateItemRow key={"Create Tournament Row"} onCreate={fetchTournaments}/>
        </tbody>

      </table>
    
    </>
  )
 
}

function StandardItemRow({item, handleEditClick, fetchItems}) {
  let status = "open";
  if (item.closed) {
    status = "closed"
  }
  return (
    <tr>
      <td><EditItemButton id={item.id} handleEditClick={handleEditClick}/></td>
      <td>{item.id}</td>
      <td>{item.tournamentName}</td>
      <td>{status}</td>
      <td><ItemDeleteButton id={item.id} onDelete={fetchItems}/></td>
      <td></td>
    </tr>
  )
}

function CreateItemRow( {onCreate} ) {
  const [item, setItem] = useState({tournamentName: "", closed: false});

  useEffect(() => {
  console.log("Updated Item State:", item);
  }, [item]);

  
  function handleChange(e) {
    const { name, value, type } = e.target;

    const finalValue = name === "closed" ? value === "true" : value;

    setItem((prevItem) => ({
      ...prevItem,
      [name]: finalValue,
    }));
  }
  
  
  
  
  return (
    <tr>
      <td></td>
      <td></td>

      <td>
        <input type="text" name="tournamentName" value={item.tournamentName} onChange={handleChange}/> 
      </td>

      <td>
        <select 
          name="closed" 
          value={item.closed.toString()} 
          onChange={handleChange}
        >
          <option value="false">Open</option>
          <option value="true">Closed</option>
        </select>
      </td>


      <td>
         <CreateItemButton itemData={item} onCreate={onCreate} setItem={setItem}/>
      </td>

      <td></td>

    </tr>
  )
    


}

function UpdateItemRow( {item_data, onUpdate, handleCancel} ) {
  const [item, setItem] = useState(item_data);

  useEffect(() => {
  console.log("Updated Item State:", item);
  }, [item]);

  
  function handleChange(e) {
    const { name, value, type } = e.target;

    const finalValue = name === "closed" ? value === "true" : value;

    setItem((prevItem) => ({
      ...prevItem,
      [name]: finalValue,
    }));
  }

  const combinedOnUpdate = () => {
    onUpdate();
    handleCancel();
  }
  
  
  
  
  return (
    <tr>
      <td><StopEditItemButton handleCancel={handleCancel}/></td>
      <td>{item.id}</td>

      <td>
        <input type="text" name="tournamentName" value={item.tournamentName} onChange={handleChange}/> 
      </td>

      <td>
        <select 
          name="closed" 
          value={item.closed.toString()} 
          onChange={handleChange}
        >
          <option value="false">Open</option>
          <option value="true">Closed</option>
        </select>
      </td>


      <td>
         <UpdateItemButton itemData={item} onUpdate={combinedOnUpdate}/>
      </td>

      <td></td>

    </tr>
  )

}



function ItemDeleteButton({id, onDelete}) {

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/tournaments/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      console.log(`Item ${id} deleted successfully`);
      // Trigger update for fetched user list
      onDelete();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  
  return (
    <>
      <button className='ChangeButton' onClick={handleDelete} style={{ color: 'red' }}>
        Delete
      </button>
    </>
  )
}

function EditItemButton({id, handleEditClick}){
  
  return (
  
    <button className='EditButton' onClick={() => {handleEditClick(id)}} style={{ color: 'blue' }}>
      Edit
    </button>
  )
}

function StopEditItemButton({handleCancel}){
   return (
  
    <button className='EditButton' onClick={handleCancel} style={{ color: 'blue' }}>
      Cancel
    </button>
  )
}

function CreateItemButton({ itemData, onCreate, setItem }) {
  const handleCreate = async () => {
    if (!window.confirm("Are you sure the items data is correct")) return;

    try {
      const response = await fetch(`/api/tournaments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData)
      });

      if (!response.ok) {
        throw new Error('Failed to create item');
      }

      onCreate();
      setItem({tournamentName: "", closed: false});
      console.log(`Item created successfully`);
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  return (
    <>
      <button className='ChangeButton' onClick={handleCreate} style={{ color: 'green' }}>
        Create
      </button>
    </>
  )
}

function UpdateItemButton({ itemData, onUpdate }) {
  const handleUpdate = async () => {
    if (!window.confirm("Are you sure the items data is correct")) return;

    try {
      const response = await fetch(`/api/tournaments/${itemData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData)
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      onUpdate();
      console.log(`Item updated successfully`);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  
  return (
    <>
      <button className='ChangeButton' onClick={handleUpdate} style={{ color: 'blue' }}>
        Update
      </button>
    </>
  )
}

export default TournamentList
