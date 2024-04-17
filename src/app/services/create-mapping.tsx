import axios from "axios";

const CreateMapping = {
  createMapping: async (mappingData: {
    fileName: string;
    providedBy: string;
  }): Promise<void> => {
    try {
      const response = await axios.post(
        "http://localhost:8080/mappings",
        mappingData,
      );

      console.log("!!!", response);
    } catch (error) {
      console.error(error);
    }
  },
};

export default CreateMapping;
