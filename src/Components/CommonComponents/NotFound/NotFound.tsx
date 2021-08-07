import React from "react";
import "./NotFound.scss";

type NotFoundProps = {
  suggestionText: string;
};

const NotFound: React.FC<NotFoundProps> = (props) => {
  return (
    <div>
      <div className={"noDataContainer"}>
        <div>
          <img alt={"no data found"} src={"./undraw_no_data_qbuo.svg"} />
        </div>
        <div>
          <p className={"primaryText"}>Hey! Something's off!</p>
          <p className={"primaryText"}>We couldn't display the given data</p>
          <span className={"secondaryText"}>{props.suggestionText}</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
