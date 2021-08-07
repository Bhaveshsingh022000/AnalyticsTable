import { IconButton, Snackbar } from "@material-ui/core";
import React from "react";
import CloseIcon from "@material-ui/icons/Close";

type AlertMessageProps = {
  toggle: (value: boolean) => void;
  isOpen: boolean;
};

const AlertMessage: React.FC<AlertMessageProps> = (props) => {
  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={props.isOpen}
        autoHideDuration={3000}
        onClose={() => props.toggle(false)}
        message="Link Copied to Clipboard"
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => props.toggle(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
};

export default AlertMessage;
