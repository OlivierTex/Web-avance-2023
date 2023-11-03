import axios from 'axios';


const searchImages = async (query) => {
  const apiKey = '2vzVSb3MiYTutC5TeAiwIn8rGEZBoyhbbBws2jTY4bZq34GJhY8vOz5U'; 
  const apiUrl = `https://api.pexels.com/v1/search?query=${query}&per_page=10`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: apiKey,
      },
    });


    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
