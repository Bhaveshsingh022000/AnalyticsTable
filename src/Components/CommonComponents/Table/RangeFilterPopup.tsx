import { Popper, Slider, makeStyles, Button } from "@material-ui/core";
import React from "react";

type RangeFilterPopupProps = {
  minValue: number;
  maxValue: number;
  isOpen: boolean;
  anchorElement: any;
  value: number | number[];
  onChange: (newValue: number | number[]) => void;
  onReset: () => void;
  onApplyChanges: () => void;
};

const useStyles = makeStyles((theme) => ({
  paper: {
    border: "1px solid",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
}));

const RangeFilterPopup: React.FC<RangeFilterPopupProps> = (props) => {
  const classes = useStyles();
  return (
    <Popper open={props.isOpen} anchorEl={props.anchorElement} transition>
      <div
        style={{ padding: "10px" }}
        className={`${classes.paper} filterPopup`}
      >
        <Slider
          max={Math.floor(props.maxValue)}
          min={Math.floor(props.minValue)}
          value={props.value}
          step={Math.floor(props.maxValue / (props.minValue + 1 * 100)) || 1}
          onChange={(event, newValue) => props.onChange(newValue)}
          style={{ width: "100%" }}
        />
        <div style={{marginBottom: "15px"}} className={"filterPopupValues"}>
          <span>{typeof props.value !== "number" && props.value[0]}</span>
          <span>{typeof props.value !== "number" && props.value[1]}</span>
        </div>
        <div className={"popupControlButtonContainer"}>
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

export default RangeFilterPopup;
