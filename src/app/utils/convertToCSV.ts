import { toCSV } from "danfojs";

// Conversion helper to support CSV, TSV, Excel (xlsx, xls) and ODS files
const convertToCSV = async (file: File): Promise<string> => {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  if (!fileExtension) {
    throw new Error("File has no extension");
  }

  // For CSV and TSV files
  if (fileExtension === "csv" || fileExtension === "tsv") {
    const dfd = await import("danfojs");
    const options: any = { dynamicTyping: false };
    if (fileExtension === "tsv") {
      options.delimiter = "\t";
    }
    const df = await dfd.readCSV(file, options);
    const reformatedDf = df.head(20).fillNa("-");
    const csvResult = toCSV(reformatedDf);
    if (!csvResult) {
      throw new Error("Failed to convert DataFrame to CSV");
    }
    return csvResult;
  }
  // For Excel or ODS files
  else if (["xlsx", "xls", "ods"].includes(fileExtension)) {
    const XLSX = await import("xlsx");
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // Convert the first sheet to CSV format
    const csv = XLSX.utils.sheet_to_csv(sheet);
    // Process the CSV string using danfo.js for consistency
    const dfd = await import("danfojs");
    const blob = new Blob([csv], { type: "text/csv" });
    const df = await dfd.readCSV(blob, {
      // @ts-ignore - Property 'dynamicTyping' does not exist on type 'CsvOptions'
      dynamicTyping: false,
    });
    const reformatedDf = df.head(20).fillNa("-");
    const csvResult = toCSV(reformatedDf);
    if (!csvResult) {
      throw new Error("Failed to convert DataFrame to CSV");
    }
    return csvResult;
  } else {
    throw new Error("Unsupported file type");
  }
};

export default convertToCSV;
