import "@testing-library/jest-dom";
import { detectXSD } from "@/app/lib/XSDDetector";

describe("detect xsd", () => {
  test("detect xsd", () => {
    expect(detectXSD("1")).toBe("integer");
  });

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
});
