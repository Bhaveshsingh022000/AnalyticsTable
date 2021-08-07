export type ColumnHeader = {
    id: number;
    name: string;
    isAdded: boolean;
    dataField: string;
    filterType: "range" | "name" | "date",
    textAlign?: "flex-end" | "flex-start" | "center",
    toggle: boolean;
  };