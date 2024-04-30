import axios from "axios";
import Cookies from "js-cookie";

export async function postColumn(columnData: {
  title: string;
  dataType: string;
  ontologyType: string;
}): Promise<void> {
  try {
    axios.defaults.headers.common["Authorization"] =
      `Bearer ${Cookies.get("accessToken")}`;
    const response = await axios.post(
      "http://localhost:8080/columns",
      columnData,
    );

    if (response.status === 200) {
      console.log("Column successfully posted");
    }
  } catch (error) {
    console.error(error);
  }
}
