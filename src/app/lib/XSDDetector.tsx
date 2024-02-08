export function detectXSD(value: string) {
  const pattern = [
    {
      type: "anyURI",
      regex: /^(?:[a-zA-Z][\w+.-]*:)?\/\/([^\/?#]+)(?:[\/?#]|$)/,
    },
    {
      type: "dateTime",
      regex:
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/,
    },
    { type: "boolean", regex: /^(true|false)$/ },
    { type: "integer", regex: /^([+-]?[1-9]\d*|0)$/ }, // 0 valid, 023 invalid
    { type: "decimal", regex: /^\d*\.?\d*$/ },
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
