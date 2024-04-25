import axios from "axios";

const PostYarrrml = {
  postYarrrml: async (): Promise<void> => {
    try {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${localStorage.getItem("token")}`;
      const response = await axios.post(
        "http://localhost:8080/yaml/yarrrmlmapper",
      );

      if (response.status === 200) {
        console.log("Yarrrml successfully executed!");
      }
    } catch (error) {
      console.error(error);
    }
  },
};

export default PostYarrrml;
