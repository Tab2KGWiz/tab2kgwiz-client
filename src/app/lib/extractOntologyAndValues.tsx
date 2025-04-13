export function extractOntologyAndValues(uri: string): {
  ontologyURI: string;
  ontologyPrefix: string;
  value: string;
} {
  let delimiter: string;

  if (uri.includes("#")) {
    delimiter = "#";
  } else {
    delimiter = "/";
  }

  let value: string = uri.split(delimiter).pop() ?? "";

  const ontologyURI: string =
    uri.substring(0, uri.lastIndexOf(delimiter)) + delimiter;

  const ontologyPrefix: string = ontologyURI.split("/").pop() ?? "";

  return { ontologyURI, ontologyPrefix, value };
}
