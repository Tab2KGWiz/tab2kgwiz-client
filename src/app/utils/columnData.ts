interface ColumnData {
  id: string | undefined; // Column ID
  title: string; // Column title
  ontologyPrefix: string | undefined; // Ontology prefix
  measurement: boolean; // Measurement or not
  identifier: boolean; // Identifier or not
  ontologyType: string | undefined; // Column ontology type
  ontologyURI: string | undefined; // Column ontology URI
  label: string | undefined; // Ontology label
  prefix: string | undefined; // Ontology prefix
  isMeasurementOf: string | undefined; // What the column is a measurement of
  dataType: string | undefined; // Data type
  hasTimestamp: string | undefined; // Has timestamp
  hasUnit: string | undefined; // Has unit
  measurementMadeBy: string | undefined; // Measurement made by
  relatedTo: string | undefined; // Related to
  relatesToProperty: string | undefined; // Relates to property
  relationShip: string | undefined; // Relationship
}

export default ColumnData;
