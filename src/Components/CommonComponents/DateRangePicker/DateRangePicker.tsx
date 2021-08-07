import React, { useState } from "react";
import {
  DateRangePicker,
  FocusedInputShape,
  isInclusivelyBeforeDay,
} from "react-dates";
import moment from "moment";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

type DatePickerProps = {
  startDateValue: (value: string) => void;
  endDateValue: (value: string) => void;
  startDate: string;
  endDate: string;
};

const DatePicker: React.FC<DatePickerProps> = (props) => {
  const [focusedInput, setFocusedInput] = useState<FocusedInputShape | null>(
    null
  );
  const handlendDatesChange = (arg: {
    startDate: moment.Moment | null;
    endDate: moment.Moment | null;
  }) => {
    props.startDateValue(arg.startDate?.format("YYYY-MM-DD") || "");
    props.endDateValue(arg.endDate?.format("YYYY-MM-DD") || "");
  };
  return (
    <div className={"date-picker"}>
      <DateRangePicker
        startDate={props.startDate ? moment(props.startDate) : null}
        startDateId="startDate"
        endDate={props.endDate ?moment(props.endDate) : null}
        endDateId="endDate"
        onDatesChange={handlendDatesChange}
        focusedInput={focusedInput}
        onFocusChange={(data: FocusedInputShape | null) =>
          setFocusedInput(data)
        }
        isOutsideRange={(day) => !isInclusivelyBeforeDay(day, moment())}
        endDatePlaceholderText={"From"}
        startDatePlaceholderText={"To"}
        transitionDuration={1}
        numberOfMonths={1}
      />
    </div>
  );
};

export default DatePicker;
