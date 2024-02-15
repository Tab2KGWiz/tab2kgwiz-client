import "@testing-library/jest-dom";
import { detectXSD } from "@/app/lib/XSDDetector";

describe("detect xsd", () => {
  test("detect xsd", () => {
    expect(detectXSD("1")).toBe("integer");
  });

  test("Test Date Data Type 01", () => {
    expect(detectXSD("2002-09-24Z")).toBe("date");
  });

  test("Test Date Data Type 02", () => {
    expect(detectXSD("2002-09-24-06:00")).toBe("date");
  });

  test("Test Date Data Type 03", () => {
    expect(detectXSD("2002-09-24+06:00")).toBe("date");
  });

  test("Test Date Data Type 04", () => {
    expect(detectXSD("2002-09-12")).toBe("date");
  });

  test("Test Time Data Type 01", () => {
    expect(detectXSD("1999")).toBe("time");
  });

  // test("Test Time Data Type 02", () => {
  //   expect(detectXSD("23:69:00")).not.toBe("time");
  // });

  // test("Test Time Data Type 03", () => {
  //   expect(detectXSD("23:59:10.5")).toBe("time");
  // });

  // test("Test Time Data Type 04", () => {
  //   expect(detectXSD("09:30:10Z")).toBe("time");
  // });

  // test("Test Time Data Type 05", () => {
  //   expect(detectXSD("09:30:10-06:00")).toBe("time");
  //   expect(detectXSD("09:30:10+06:00")).toBe("time");
  //   expect(detectXSD("09:30:10+")).toBe("time");
  // });

  // test("Test Time Data Type", () => {
  //   expect(detectXSD("24:59:59")).toBe("dateTime");
  // });
});
