const fetchTournaments = async () => {
try {
    const response = await fetch("/api/tournaments/all");
    const data = await response.json();
    if (!response.ok) {
    throw new Error(data.message);
    }
    const dataListJson = data;
    console.log(dataListJson);
    setDataList(dataListJson);

} catch (error) {
    toast.error('Error fetching data:' + error.message)
    console.error('Error fetching data:', error);
    setDataList([]); 
}

};