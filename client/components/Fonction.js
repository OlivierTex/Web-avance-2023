import axios from "axios";

export const fetchImageDetails = async (id, setImageDetails, supabase) => {
  const apiKey = getAPIKey();
  const baseUrl = getAPIBaseURL();
  const url = `${baseUrl}/photos/${id}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: apiKey },
    });
    setImageDetails(response.data);
    await checkAndUpdateViews(id, supabase);
  } catch (error) {
    console.error("Fetching image details failed:", error);
  }
};
