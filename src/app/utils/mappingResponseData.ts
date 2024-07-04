import MeasurementColumnData from "./measurementColumnData";

interface MappingResponseData {
  fileContent: string;
  fileName: string;
  accessible: boolean;
  title: string;
  providedBy: string;
  columns: MeasurementColumnData[];
}

export default MappingResponseData;
