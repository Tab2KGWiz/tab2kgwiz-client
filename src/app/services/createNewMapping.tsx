"use client";
import { toCSV } from "danfojs";
import { DataFrame } from "danfojs/dist/danfojs-base";
import PostMapping from "./post-mapping";

export async function createNewMapping(file: File, df: DataFrame) {
  (async () => {
    const mappingData = {
      title: file.name,
      fileContent: toCSV(df),
      fileFormat: file.type.split("/")[1],
      fileName: file.name,
      mainOntology: "schema:Pork",
      // prefixesURIS:
      //   "http://www.example.com/,http://myontology.com/,http://schema.org/",
    };

    const newMapping = await PostMapping.postMapping(mappingData);
  })();
}
