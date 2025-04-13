import axios from "axios";

const handleDefaultOntologySearch = async (
  value: React.Key,
  setFetchedOntologyData: (
    value: React.SetStateAction<
      | {
          getFrom: string;
          itemText: string;
          prefixed: string;
          iri: {
            value: string;
          };
          label: string;
          iriSplitA: string;
          prefixedSplitA: string;
        }[]
      | undefined
    >,
  ) => void,
) => {
  setFetchedOntologyData([]);

  const response = await axios.get(`http://localhost:4000/api/${value}`);

  const data: {
    // agroportal: [
    //   {
    //     label: string;
    //     prefixedName: string;
    //     uri: string;
    //   },
    // ];
    bioportal: [
      {
        label: string;
        prefixedName: string;
        uri: string;
      },
    ];
    // lov: [
    //   {
    //     label: string;
    //     prefixedName: string;
    //     uri: string;
    //   },
    // ];
    zazuko: [
      {
        label: string;
        prefixedName: string;
        uri: string;
      },
    ];
  } = response.data;

  // data.lov.forEach((item) => {
  //   setFetchedOntologyData((prev) => [
  //     ...(prev || []),
  //     {
  //       getFrom: "LOV",
  //       itemText: item.prefixedName + " (" + item.label + ")",
  //       prefixed: item.prefixedName,
  //       iri: { value: item.uri },
  //       label: item.label,
  //       iriSplitA: item.uri,
  //       prefixedSplitA: item.prefixedName.split(":").pop() || "",
  //     },
  //   ]);
  // });

  // data.agroportal.forEach((item) => {
  //   setFetchedOntologyData((prev) => [
  //     ...(prev || []),
  //     {
  //       getFrom: "Agroportal",
  //       itemText: item.prefixedName + " (" + item.label + ")",
  //       prefixed: item.prefixedName,
  //       iri: { value: item.uri },
  //       label: item.label,
  //       iriSplitA: item.uri,
  //       prefixedSplitA: item.prefixedName.split(":").pop() || "",
  //     },
  //   ]);
  // });

  data.zazuko.forEach((item) => {
    setFetchedOntologyData((prev) => [
      ...(prev || []),
      {
        getFrom: "Zazuko",
        itemText: item.prefixedName + " (" + item.label + ")",
        prefixed: item.prefixedName,
        iri: { value: item.uri },
        label: item.label,
        iriSplitA: item.uri,
        prefixedSplitA: item.prefixedName.split(":").pop() || "",
      },
    ]);
  });

  data.bioportal.forEach((item) => {
    setFetchedOntologyData((prev) => [
      ...(prev || []),
      {
        getFrom: "Bioportal",
        itemText: item.prefixedName + " (" + item.label + ")",
        prefixed: item.prefixedName,
        iri: { value: item.uri },
        label: item.label,
        iriSplitA: item.uri,
        prefixedSplitA: item.prefixedName.split(":").pop() || "",
      },
    ]);
  });
};

export default handleDefaultOntologySearch;
