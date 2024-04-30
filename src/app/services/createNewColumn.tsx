"use client";
import { postColumn } from "./post-column";

export async function createNewColumn(columnData: {
  title: string;
  dataType: string;
  ontologyType: string;
}): Promise<number> {
  try {
    if ((await postColumn(columnData)) === 0) {
      return 0;
    } else return -1;
  } catch (error) {
    return -1;
  }
}
