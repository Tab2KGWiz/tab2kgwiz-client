import axios from "axios";

const PostColumn = {
  postColumn: async (columnData: {
    title: string;
    dataType: string;
    ontologyType: string;
  }): Promise<void> => {
    try {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${localStorage.getItem("token")}`;
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
  },
};

export default PostColumn;
