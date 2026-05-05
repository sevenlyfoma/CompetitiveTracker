import toast from 'react-hot-toast';

export async function fetchData(pathname, setData){
    try {

        const response = await fetch(pathname);

        const data = await response.json();

        if (!response.ok) {

            const errorMessage = data?.message ?? response.statusText ?? "An unexpected error occurred";
            throw new Error(errorMessage);
        }

        console.log(data);
        setData(data); 

    } catch (error) {
        toast.error('Error fetching data: ' + error.message)
        console.error('Error fetching data: ', error.message); 
    }   
}

export async function postData(pathname, sendData, onPost){
    try {
        if (!window.confirm("Are you sure the entered data is correct")) return;

        const response = await fetch(pathname, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(sendData)
        });
        const data = await response.json();
        if (!response.ok) {

            const errorMessage = data?.message ?? response.statusText ?? "An unexpected error occurred";
            throw new Error(errorMessage);
        }

        onPost();

    } catch (error) {
        toast.error('Error sending data: ' + error.message)
        console.error('Error sending data: ', error.message); 
    }
}