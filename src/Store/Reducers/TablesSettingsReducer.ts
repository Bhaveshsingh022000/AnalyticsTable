import { ColumnHeader } from "../../Components/CommonComponents/Table/TableDataTypes";
import { analyticsTableColumnHeaders } from "../../Constants/TableColumns";
import { actionTypes } from "../Actions/TablesSettingsAction";

export type TablesSettingsState = {
  columnsOrder: number[];
  columnsList: ColumnHeader[];
  showSettingsTab: boolean;
  startingDate: string;
  endingDate: string;
};

export const initialState: TablesSettingsState = {
  columnsOrder: analyticsTableColumnHeaders.map((item, index) => index),
  columnsList: analyticsTableColumnHeaders,
  showSettingsTab: false,
  endingDate: "",
  startingDate: "",
};

export type SettingsAction<T> = {
  type: string;
  payload: T;
};

export const tablesSettingReducer = (
  state = initialState,
  actions: SettingsAction<any>
): TablesSettingsState => {
  switch (actions.type) {
    case actionTypes.UPDATE_STARTING_DATE:
      return {
        ...state,
        startingDate: actions.payload,
      };
    case actionTypes.UPDATE_ENDING_DATE:
      return {
        ...state,
        endingDate: actions.payload,
      };
    case actionTypes.TOGGLE_SETTINGS_TAB:
      return {
        ...state,
        showSettingsTab: actions.payload,
      };
    case actionTypes.UPDATE_COLUMN_DISPLAY:
      return {
        ...state,
        columnsList: state.columnsList.map((column) => {
          
          return {
            ...column,
            isAdded: actions.payload[column.id],
          };
        }),
      };
    case actionTypes.UPDATE_COLUMN_ORDER:
      return {
        ...state,
        columnsOrder: actions.payload,
      };
    default:
      return state;
  }
};
