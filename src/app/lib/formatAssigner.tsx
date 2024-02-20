import { checkDecimalOrInteger } from "./checkDecimalOrInteger";
import { checkDayMonthYear } from "./checkDayMonthYear";
import { detectXSD } from "./XSDDetector";

export function formatAssigner(
  rowsWithoutNull: string[][],
  index: number,
  headerMapping: Map<string, string>,
  header: string,
) {
  if (rowsWithoutNull[0][index].match(/\d+[.,]\d{3}$/)) {
    const format = checkDecimalOrInteger(
      rowsWithoutNull.slice(0, 10).map((row) => row[index]),
    );

    headerMapping.set(header, format);
  } else if (
    rowsWithoutNull[0][index].match(/^(0[1-9]|[12][0-9]|3[01])$/) ||
    rowsWithoutNull[0][index].match(/^(0[1-9]|1[0-2])$/) ||
    rowsWithoutNull[0][index].match(/^\d{4}$/)
  ) {
    const format = checkDayMonthYear(
      rowsWithoutNull.slice(0, 10).map((row) => row[index]),
    );
    headerMapping.set(header, format);
  } else {
    headerMapping.set(header, detectXSD(rowsWithoutNull[0][index]));
  }
}
