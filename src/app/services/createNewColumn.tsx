import axios from "axios";
import Cookies from "js-cookie";

export async function createNewColumn(
  mappingId: number,
  columnData: {
    title: string;
    dataType: string;
    ontologyType: string;
  },
): Promise<number> {
  try {
    axios.defaults.headers.common["Authorization"] =
      `Bearer ${Cookies.get("accessToken")}`;
    const response = await axios.post(
      `http://localhost:8080/mappings/${mappingId}/columns`,
      columnData,
    );

    if (response.status === 200) {
      return 0;
    } else return -1;
  } catch (error) {
    return -1;
  }
}
