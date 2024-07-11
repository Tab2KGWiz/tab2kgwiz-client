import axios from "axios";

async function postYarrrml(
  mappingFile: File | null,
  mappingId: number,
): Promise<String> {
  try {
    if (!mappingFile) {
      console.error("No se ha seleccionado ningún archivo.");
      return "-1";
    }

    const formData = new FormData();
    formData.append("csvFile", mappingFile);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_TAB2KGWIZ_API_URL}/mappings/${mappingId}/generate`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    }
    return "-1";
  } catch (error) {
    return "-1";
  }
}

export default postYarrrml;
