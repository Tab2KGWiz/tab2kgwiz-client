import axios from "axios";
import Cookies from "js-cookie";

export async function postMapping(mappingData: {
  title: string;
  fileContent: string | void;
  fileFormat: string;
  fileName: string;
  mainOntology: string;
}): Promise<number> {
  try {
    axios.defaults.headers.common["Authorization"] =
      `Bearer ${Cookies.get("accessToken")}`;
    const response = await axios.post(
      "http://localhost:8080/mappings",
      mappingData,
    );

    if (response.status === 201) {
      return 0;
    } else return -1;
  } catch (error) {
    return -1;
  }
}
