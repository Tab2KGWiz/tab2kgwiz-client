"use client";
import { toCSV } from "danfojs";
import { DataFrame } from "danfojs/dist/danfojs-base";
import { postMapping } from "./post-mapping";

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

    if ((await postMapping(mappingData)) === 0) {
      return 0;
    } else return -1;
  } catch (error) {
    return -1;
  }
}
