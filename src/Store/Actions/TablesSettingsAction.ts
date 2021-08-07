import { SettingsAction } from "../Reducers/TablesSettingsReducer";

export const actionTypes = {
  UPDATE_COLUMN_DISPLAY: "UPDATE_COLUMN_DISPLAY",
  UPDATE_COLUMN_ORDER: "UPDATE_COLUMN_ORDER",
  TOGGLE_SETTINGS_TAB: "TOGGLE_SETTINGS_TAB",
  UPDATE_STARTING_DATE: "UPDATE_STARTING_DATE",
  UPDATE_ENDING_DATE: "UPDATE_ENDING_DATE"
};

export const updateColumnDisplay = (
  display: Record<number,boolean>
): SettingsAction<Record<number,boolean>> => {
  return {
    type: actionTypes.UPDATE_COLUMN_DISPLAY,
    payload: display
  };
};

export const updateColumnOrder = (order:number[]): SettingsAction<number[]> =>{
  return{
    type: actionTypes.UPDATE_COLUMN_ORDER,
    payload: order
  }
}

export const toggleSettingsTab = (value: boolean): SettingsAction<boolean> =>{
  return{
    type: actionTypes.TOGGLE_SETTINGS_TAB,
    payload: value
  }
}

export const updateStartingDate = (value: string):SettingsAction<string> => {
  return{
    type: actionTypes.UPDATE_STARTING_DATE,
    payload: value
  }
}

export const updateEndingDate = (value: string):SettingsAction<string> => {
  return{
    type: actionTypes.UPDATE_ENDING_DATE,
    payload: value
  }
}