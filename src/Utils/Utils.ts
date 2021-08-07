import moment from "moment";
import { ColumnHeader } from "../Components/CommonComponents/Table/TableDataTypes";

export const getMaxValuesOfColumns = (data: any[]): Record<string, number> => {
  const columnsMap: Record<string, number> = {};
  data.forEach((item) => {
    for (const [key, value] of Object.entries<any>(item)) {
      columnsMap[key] = Math.max(columnsMap[key] || 0, Math.floor(value) || 0);
    }
  });
  return columnsMap;
};

export const filterColumnOnRange = (
  data: any[],
  columnHeaders: ColumnHeader[],
  columnRange: Record<number, number[]>
) => {
  if (data.length === 0) {
    return data;
  }
  const filteredData: any[] = data.filter((item) => {
    for (const column of columnHeaders) {
      if (column.filterType === "name") {
        continue;
      }
      if (column.filterType === "date") {
        continue;
      }
      if (
        parseInt(item[column.dataField as keyof any].toString()) >=
          columnRange[column.id][0] &&
        parseInt(item[column.dataField as keyof any].toString()) <=
          columnRange[column.id][1]
      ) {
        console.log("f");
        continue;
      }

      return false;
    }
    return true;
  });

  return filteredData;
};

export const dateFilterValidation = (
  filterType: number,
  value: Date,
  comparatoreValue: Date
): boolean => {
  if (filterType === 1) {
    console.log(moment(comparatoreValue).isSame(value));
    return moment(comparatoreValue).isSame(value);
  }
  if (filterType === 2) {
    return !moment(comparatoreValue).isSame(value);
  }
  if (filterType === 3) {
    return moment(comparatoreValue).isAfter(value);
  }
  if (filterType === 4) {
    return moment(comparatoreValue).isSameOrAfter(value);
  }
  if (filterType === 5) {
    return moment(comparatoreValue).isBefore(value);
  }
  if (filterType === 6) {
    return moment(comparatoreValue).isSameOrBefore(value);
  }
  return false;
};

export const convertToInternationalCurrencySystem = (labelValue: number) => {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
    : // Three Zeroes for Thousands
    Math.abs(Number(labelValue)) >= 1.0e3
    ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
    : Math.abs(Number(labelValue));
};

const monthsMap: Record<number,string> = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export const dateToMonthStringDate = (date: Date):string => {
  return `${date.getDate()} ${monthsMap[date.getMonth()]} ${date.getFullYear()}`
};
