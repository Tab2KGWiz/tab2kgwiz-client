import axios from "axios";

const PostYaml = {
  postYaml: async (mappingName: string): Promise<void> => {
    try {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${localStorage.getItem("token")}`;
      const response = await axios.post(
        "http://localhost:8080/yaml/generate",
        mappingName,
      );

      if (response.status === 200) {
        console.log("Yaml successfully generated");
      }
    } catch (error) {
      console.error(error);
    }
  },
};

export default PostYaml;
