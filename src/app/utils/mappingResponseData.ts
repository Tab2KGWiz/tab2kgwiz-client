import ColumnData from "./columnData";

interface MappingResponseData {
  fileContent: string; // File conteng
  fileName: string; // File name
  accessible: boolean; // Public or private
  title: string; // Mapping title
  providedBy: string; // Supplier that provided the mapping
  columns: ColumnData[]; // Columns list
}

export default MappingResponseData;
