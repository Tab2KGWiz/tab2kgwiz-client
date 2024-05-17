import axios from "axios";
import Cookies from "js-cookie";

export async function postYaml(mappingId: number): Promise<number> {
  try {
    axios.defaults.headers.common["Authorization"] =
      `Bearer ${Cookies.get("accessToken")}`;
    const response = await axios.post(
      `http://localhost:8080/mappings/${mappingId}/yaml/generate`,
    );

    if (response.status === 200) {
      return 0;
    }
    return -1;
  } catch (error) {
    return -1;
  }
}
