import toast from 'react-hot-toast';

async function fetchData(pathname, setData){
    try {

        const response = await fetch(pathname);

        const data = await response.json();

        if (!response.ok) {

            const errorMessage = data?.message ?? response.statusText ?? "An unexpected error occurred";
            throw new Error(errorMessage);
        }

        setData(data);

    } catch (error) {
        toast.error('Error fetching data: ' + error.message)
        console.error('Error fetching data: ', error.message); 
    }   
}

export default fetchTournaments