import axios from "axios";
import Cookies from "js-cookie";

const PostYarrrml = {
  postYarrrml: async (): Promise<void> => {
    try {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${Cookies.get("accessToken")}`;
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
