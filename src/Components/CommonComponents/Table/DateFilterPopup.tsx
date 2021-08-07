import { Popper, Button } from "@material-ui/core";
import React from "react";
import { dateFilterDropDown } from "../../../Constants/DropdownConstants";
import "./DateFilterPopup.scss";

type DateFilterPopupProps = {
  isOpen: boolean;
  anchorElement: any;
  onReset: () => void;
  filterType: number;
  dateValue: string;
  onFilterTypeChange: (value: number) => void;
  onDateValueChange: (Value: string) => void;
  onApplyChanges: () => void;
};

const DateFilterPopup: React.FC<DateFilterPopupProps> = (props) => {
  return (
    <Popper open={props.isOpen} anchorEl={props.anchorElement} transition>
      <div className={"dateFilterContainer"}>
        <div className={"selectAndDateContainer"}>
          <select
            value={props.filterType}
            onChange={(event) =>
              props.onFilterTypeChange(parseInt(event.target.value))
            }
          >
            {dateFilterDropDown.map((option) => (
              <option key={option.id} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
          <input
            type="date"
            onChange={(event) => props.onDateValueChange(event.target.value)}
            value={props.dateValue}
            name="date"
          />
        </div>

        <div className={"controlButtonContainer"}>
          <Button
            variant={"contained"}
            className={"secondaryButton"}
            onClick={() => props.onReset()}
          >
            Reset
          </Button>
          <Button
            variant={"contained"}
            className={"primaryButton"}
            onClick={() => props.onApplyChanges()}
          >
            Apply Changes
          </Button>
        </div>
      </div>
    </Popper>
  );
};

export default DateFilterPopup;
