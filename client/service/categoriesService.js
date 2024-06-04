import axios from "axios";

const categoriesService = async (accessToken) => {
  try {   
    const response = await axios.get(
      `https://api.spotify.com/v1/browse/categories`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const categoriesData = response.data;
    return {
      items: categoriesData.categories.items.map((item) => ({
        id: item.id,
        name: item.name,
        icons: item.icons.map((icon)=>({
            url: icon.url,
            height: icon.height,
            width: icon.width,
        }))
      })),
    };
  } catch (error) {
    console.error("Error fetching Get Several Browse Categories:", error);
    throw error;
  }
};

export { categoriesService };
