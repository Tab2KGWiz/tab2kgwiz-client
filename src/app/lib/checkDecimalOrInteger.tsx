export function checkDecimalOrInteger(value: string[]) {
  // If contains both comma and dot, then it's a decimal
  for (let v of value) {
    if (v.includes(",") && v.includes(".")) {
      return "decimal";
    }
  }

  // Match the pattern of a number with a three digits with dot separator
  return value.every((v) => v.match(/^\d{1,3}((\.|,)\d{3})*$/))
    ? "integer"
    : "decimal";
}
