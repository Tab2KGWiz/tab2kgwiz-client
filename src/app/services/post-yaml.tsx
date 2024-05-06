import axios from "axios";
import Cookies from "js-cookie";

export async function postYaml(mappingName: string): Promise<number> {
  try {
    axios.defaults.headers.common["Authorization"] =
      `Bearer ${Cookies.get("accessToken")}`;
    const response = await axios.post(
      "http://localhost:8080/yaml/generate",
      mappingName,
    );

    if (response.status === 200) {
      return 0;
    }
    return -1;
  } catch (error) {
    return -1;
  }
}
