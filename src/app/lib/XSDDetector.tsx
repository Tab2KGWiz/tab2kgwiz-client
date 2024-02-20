export function detectXSD(value: string) {
  const pattern = [
    {
      type: "anyURI",
      regex: /^(?:[a-zA-Z][\w+.-]*:)?\/\/([^\/?#]+)(?:[\/?#]|$)/,
    },
    {
      type: "date",
      regex: /^\d{4}-\d{2}-\d{2}(Z|([-+]\d{2}:\d{2})?)?$/,
    },
    {
      type: "time",
      regex:
        /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[-+][01]\d:[0-5]\d)?$/,
    },
    {
      type: "dateTime",
      regex:
        /^(\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[-+][01]\d:[0-5]\d)?)$/,
    },
    {
      type: "duration",
      regex: /^P(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?:\d+H)?(?:\d+M)?)?|-P\d+D$/,
    },
    {
      type: "gMonthDay",
      regex: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
    },
    {
      type: "gYearMonth",
      regex: /^\d{4}-(0[1-9]|1[0-2])$/,
    },
    { type: "boolean", regex: /^(true|false)$/ },
    { type: "integer", regex: /^([+-]?[1-9]\d*|0)$/ }, // 0 valid, 023 invalid
    { type: "decimal", regex: /^[-+]?(\d*\.?\d+|\d+\.\d*)$/ },
    { type: "float", regex: /^^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/ },
    { type: "double", regex: /^-?\d+(\.\d+)?([eE][-+]?\d+)?$/ },
    // { type: "decimal", regex: /^-?\d+(\.\d+)?$/ },
    { type: "string", regex: /.*/ },
  ];

  for (let p of pattern) {
    // if (p.regex.test(value)) {
    //   return p.type;
    // }
    if (new RegExp(p.regex).test(value)) {
      return p.type;
    }
  }

  return "unknown type";
}
