import "@testing-library/jest-dom";
import { detectXSD } from "@/app/lib/XSDDetector";
import { checkDecimalOrInteger } from "@/app/lib/checkDecimalOrInteger";
import { checkDayMonthYear } from "@/app/lib/checkDayMonthYear";

describe("detect xsd", () => {
  test("Test Date Data Type", () => {
    expect(detectXSD("2002-09-24Z")).toBe("date");
    expect(detectXSD("2002-09-24-06:00")).toBe("date");
    expect(detectXSD("2002-09-24+06:00")).toBe("date");
    expect(detectXSD("2002-09-12")).toBe("date");
  });

  test("Test Time Data Type", () => {
    expect(detectXSD("23:69:00")).not.toBe("time");
    expect(detectXSD("09:00:00")).toBe("time");
    expect(detectXSD("09:30:10Z")).toBe("time");
    expect(detectXSD("09:30:10.5")).toBe("time");
    expect(detectXSD("09:30:10-06:00")).toBe("time");
    expect(detectXSD("09:30:10+06:00")).toBe("time");
    expect(detectXSD("09:30:10+")).not.toBe("time");
  });

  // Month days?
  test("Test Date time Data Type", () => {
    expect(detectXSD("2002-05-30T09:00:00")).toBe("dateTime");
    expect(detectXSD("2002-05-30T09:30:10.5")).toBe("dateTime");
    expect(detectXSD("2002-05-30T09:30:10Z")).toBe("dateTime");
    expect(detectXSD("2002-05-30T09:30:10-06:00")).toBe("dateTime");
    expect(detectXSD("2002-05-30T09:30:10+06:00")).toBe("dateTime");
    expect(detectXSD("2002-05-30T24:69:60+06:00")).not.toBe("dateTime");
    expect(detectXSD("2002-05-30T09:30:10+06:0")).not.toBe("dateTime");
  });

  test("Test duration Data Type", () => {
    expect(detectXSD("P5Y")).toBe("duration");
    expect(detectXSD("P5Y2M10D")).toBe("duration");
    expect(detectXSD("P5Y2M10DT15H")).toBe("duration");
    expect(detectXSD("PT15H")).toBe("duration");
    expect(detectXSD("-P10D")).toBe("duration");
    expect(detectXSD("5Y2M10D")).not.toBe("duration");
  });

  test("Test gMonthDay Data Type", () => {
    expect(detectXSD("12-31")).toBe("gMonthDay");
    expect(detectXSD("13-31")).not.toBe("gMonthDay");
    expect(detectXSD("09-32")).not.toBe("gMonthDay");
  });

  test("Test gYearMonth Data Type", () => {
    expect(detectXSD("2000-07")).toBe("gYearMonth");
    expect(detectXSD("1999-13")).not.toBe("gYearMonth");
  });

  const days = ["22", "31", "01"];
  const incorrectgDays = ["22", "32", "0"];

  test("Test gDay Data Type", () => {
    expect(checkDayMonthYear(days)).toBe("gDay");
    expect(checkDayMonthYear(incorrectgDays)).not.toBe("gDay");
  });

  const months = ["01", "12", "08"];
  const incorrectMonths = ["12", "13", "03"];

  test("Test gMonth Data Type", () => {
    expect(checkDayMonthYear(months)).toBe("gMonth");
    expect(checkDayMonthYear(incorrectMonths)).not.toBe("gMonth");
  });

  const years = ["1900", "2003", "1723"];

  test("Test gYear Data Type", () => {
    expect(checkDayMonthYear(years)).toBe("gYear");
  });

  test("Test integer Data Type", () => {
    expect(detectXSD("999")).toBe("integer");
    expect(detectXSD("+999")).toBe("integer");
    expect(detectXSD("-999")).toBe("integer");
    expect(detectXSD("0")).toBe("integer");
    expect(detectXSD("0.0")).not.toBe("integer");
  });

  test("Test decimal Data Type", () => {
    expect(detectXSD("999.50")).toBe("decimal");
    expect(detectXSD("+999.5450")).toBe("decimal");
    expect(detectXSD("-999.5230")).toBe("decimal");
    expect(detectXSD("999.50.2")).not.toBe("decimal");
  });

  const commaValues = [
    "2,000",
    "2,233",
    "32,121",
    "32,121,000",
    "212,141",
    "311,212,121",
    "311,181",
    "832,120",
    "82,129",
    "932,121",
  ];

  const dotValues = [
    "2.000",
    "2.233",
    "32.121",
    "32.121.000",
    "212.141",
    "311.212.121",
    "311.181",
    "832.120",
    "82.129",
    "932.121",
  ];

  const commaDotValues = [
    "311.212.121",
    "311,212.121",
    "311,212.121",
    "311.212.121",
    "311.212.121",
    "311.212.121",
    "311.181",
    "832.120",
    "82.129",
    "932.121",
  ];

  test("Test thousand decimal or integer Data Type", () => {
    expect(checkDecimalOrInteger(commaValues)).toBe("integer");
    expect(checkDecimalOrInteger(dotValues)).toBe("integer");
    expect(checkDecimalOrInteger(commaDotValues)).toBe("decimal");
  });
});
