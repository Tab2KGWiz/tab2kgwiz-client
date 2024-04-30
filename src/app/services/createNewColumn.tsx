"use client";
import { postColumn } from "./post-column";

export async function createNewColumn(columnData: {
  title: string;
  dataType: string;
  ontologyType: string;
}) {
  (async () => {
    const newColumn = await postColumn(columnData);
  })();
}
