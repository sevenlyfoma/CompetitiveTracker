import toast from 'react-hot-toast';

async function fetchData(pathname, setData){
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

async function fetchDatas(pathnames, setData){
    try {

        const entries = Object.entries(pathnames);
        const urls = entries.map(([key, url]) => url);

        const results = await Promise.allSettled(urls.map(url => fetch(url)));

        const successfulData = {};

        for (let i = 0; i < results.length; i++) {
            const [key] = entries[i];
            const result = results[i];

            if (result.status === 'fulfilled' && result.value.ok) {
                const data = await result.value.json();
                successfulData[key] = data;
            } else {
                console.error(`Error fetching ${key}:`, result.reason || result.value?.statusText);
            }
        }

        setData(successfulData);

    } catch (error) {
        toast.error('Error fetching data: ' + error.message)
        console.error('Error fetching data: ', error.message); 
    }   
}


export default fetchData