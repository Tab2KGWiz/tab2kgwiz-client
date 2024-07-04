interface MeasurementColumnData {
  id: string | undefined;
  title: string;
  ontologyPrefix: string | undefined;
  measurement: boolean;
  identifier: boolean;
  ontologyType: string | undefined;
  ontologyURI: string | undefined;
  label: string | undefined;
  prefix: string | undefined;
  isMeasurementOf: string | undefined;
  dataType: string | undefined;
  hasTimestamp: string | undefined;
  hasUnit: string | undefined;
  hasValue: string | undefined;
  measurementMadeBy: string | undefined;
  relatedTo: string | undefined;
  relatesToProperty: string | undefined;
  relationShip: string | undefined;
}

export default MeasurementColumnData;
