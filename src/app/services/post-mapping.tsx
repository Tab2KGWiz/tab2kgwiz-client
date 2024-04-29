import axios from "axios";

const PostMapping = {
  postMapping: async (mappingData: {
    title: string;
    fileContent: string | void;
    fileFormat: string;
    fileName: string;
    mainOntology: string;
  }): Promise<void> => {
    try {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${localStorage.getItem("token")}`;
      const response = await axios.post(
        "http://localhost:8080/mappings",
        mappingData,
      );

      if (response.status === 200) {
        console.log("Mapping successfully posted");
      }
    } catch (error) {
      console.error(error);
    }
  },
};

export default PostMapping;