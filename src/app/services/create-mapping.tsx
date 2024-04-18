import axios from "axios";

const CreateMapping = {
  createMapping: async (mappingData: { title: string }): Promise<void> => {
    try {
      // const response = await axios.get("http://localhost:8080/userLoggedIn");
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${localStorage.getItem("token")}`;
      const response = await axios.post(
        "http://localhost:8080/mappings",
        mappingData,
      );

      console.log("!!!", response);
    } catch (error) {
      console.error(error);
    }
  },
};

export default CreateMapping;
