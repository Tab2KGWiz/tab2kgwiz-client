"use client";
import PostColumn from "./post-column";

export async function createNewColumn(columnData: {
  title: string;
  dataType: string;
  ontologyType: string;
}) {
  (async () => {
    const newColumn = await PostColumn.postColumn(columnData);
  })();
}
