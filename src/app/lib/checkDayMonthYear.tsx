export function checkDayMonthYear(value: string[]) {
  // From less rescritive to more restrictive
  if (value.every((v) => v.match(/^(0[1-9]|1[0-2])$/))) {
    return "gMonth";
  } else if (value.every((v) => v.match(/^(0[1-9]|[12][0-9]|3[01])$/))) {
    return "gDay";
  } else if (value.every((v) => v.match(/^\d{4}$/))) {
    return "gYear";
  }
  return "integer";
}
