import {
  Popper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Checkbox,
} from "@material-ui/core";
import React, { useMemo, useState } from "react";
import "./NameFilterPopup.scss";

type NameFilterPopupProps = {
  namesList: {
    id: number;
    name: string;
  }[];
  isOpen: boolean;
  anchorElement: any;
  onReset: () => void;
  onApplyChanges: () => void;
  onSelectNames: (id: number, checked: boolean) => void;
  values: Record<number, boolean>;
};

const NameFilterPopup: React.FC<NameFilterPopupProps> = (props) => {
  const [searchText, setSearchText] = useState("");
  
  const listData = useMemo(() => {
    return searchText === ""
      ? props.namesList
      : props.namesList.filter((name) =>
          name.name.toLowerCase().includes(searchText)
        );
  }, [props.namesList, searchText]);

  return (
    <Popper open={props.isOpen} anchorEl={props.anchorElement} transition>
      <div className={"nameFilterPopupContainer"}>
        <input
          type="text"
          onChange={(event) => setSearchText(event.target.value.toLowerCase())}
          value={searchText}
          className={"searchField"}
        />
        <List dense>
          {listData.map((name) => {
            return (
              <ListItem key={name.id} button>
                <ListItemText primary={name.name} />
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    onChange={(event, checked) =>
                      props.onSelectNames(name.id, checked)
                    }
                    checked={props.values[name.id] || false}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
        <div className={"popupControlButtonContainer"}>
          <Button
            className={"secondaryButton"}
            variant={"contained"}
            onClick={() => {
              setSearchText("");
              props.onReset();
            }}
          >
            Reset
          </Button>
          <Button
            className={"primaryButton"}
            variant={"contained"}
            onClick={() => {
              setSearchText("");
              props.onApplyChanges();
            }}
          >
            Apply Changes
          </Button>
        </div>
      </div>
    </Popper>
  );
};

export default NameFilterPopup;
