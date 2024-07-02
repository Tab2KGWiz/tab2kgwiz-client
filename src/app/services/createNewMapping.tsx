"use client";
import { toCSV } from "danfojs";
import { DataFrame } from "danfojs/dist/danfojs-base";
import axios from "axios";
import Cookies from "js-cookie";

interface MappingResponseData {
  uri: string;
  title: string;
  fileContent: string;
}

export async function createNewMapping(
  file: File,
  df: DataFrame,
): Promise<number> {
  try {
    const mappingData = {
      title: file.name.replace(/\s+/g, ""),
      fileContent: toCSV(df),
      fileFormat: file.type.split("/")[1],
      fileName: file.name.replace(/\s+/g, ""),
      mainOntology: "schema:Pork",
      // prefixesURIS:
      //   "http://www.example.com/,http://myontology.com/,http://schema.org/",
    };

    axios.defaults.headers.common["Authorization"] =
      `Bearer ${Cookies.get("accessToken")}`;
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_TAB2KGWIZ_API_URL}/mappings`,
      mappingData,
    );

    if (response.status === 201) {
      const data: MappingResponseData = response.data;

      // Obtain the ID of the mapping by extracting the last number from the URI
      return parseInt(data.uri.match(/\d+$/)?.[0] || "-1");
    } else return -1;
  } catch (error) {
    return -1;
  }
}
