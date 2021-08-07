import React, { useState, useEffect } from "react";
import { bindActionCreators, Dispatch } from "redux";
import { TablesSettingsState } from "../../../../Store/Reducers/TablesSettingsReducer";
import "./SettingsView.scss";
import * as TableSettingsActions from "../../../../Store/Actions/TablesSettingsAction";
import { connect } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Grid, Button } from "@material-ui/core";
import { isEqual } from "lodash";

const mapStateToProps = (state: TablesSettingsState) => {
  return {
    columnsList: state.columnsList,
    columnsOrder: state.columnsOrder,
    settingsTableDisplay: state.showSettingsTab,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      updateColumnDisplay: TableSettingsActions.updateColumnDisplay,
      updateColumnOrder: TableSettingsActions.updateColumnOrder,
      toggleSettingsTab: TableSettingsActions.toggleSettingsTab,
    },
    dispatch
  );
};

type SettingsViewProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const SettingsView: React.FC<SettingsViewProps> = (props) => {
  const [columnsOrder, setColumnsOrder] = useState<number[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    setColumnsOrder(props.columnsOrder);
    const columns = { ...visibleColumns };
    props.columnsList.forEach((item) => {
      columns[item.id] = item.isAdded;
    });
    setVisibleColumns(columns);
  }, [props.columnsOrder, props.columnsList]);

  const onChangeColumnVisiability = (colId: number) => {
    const columns = { ...visibleColumns };
    if (columns[colId]) {
      columns[colId] = false;
      setVisibleColumns(columns);
      return;
    }
    columns[colId] = true;
    setVisibleColumns(columns);
  };

  return (
    <div className="settingsContainer">
      <div>Dimensions and Metrics</div>
      <DragDropContext
        onDragEnd={(result) => {
          if (result.destination?.index === undefined) {
            return;
          }
          const order = [...props.columnsOrder];
          [order[result.destination.index || 0], order[result.source.index]] = [
            order[result.source.index],
            order[result.destination.index || 0],
          ];
          setColumnsOrder(order);
        }}
      >
        <Droppable direction={"horizontal"} droppableId={"ColumnsHeader"}>
          {(provider) => (
            <div
              {...provider.droppableProps}
              ref={provider.innerRef}
              className="columnListContainer"
            >
              {columnsOrder.map((order, index) => (
                <Draggable
                  key={order}
                  draggableId={order.toString()}
                  index={index}
                >
                  {(provided) => (
                    <Grid
                      item
                      xs={2}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() =>
                        props.columnsList[order].toggle &&
                        onChangeColumnVisiability(props.columnsList[order].id)
                      }
                      className={
                        visibleColumns[props.columnsList[order].id]
                          ? "visibleColumn"
                          : "hiddenColumn"
                      }
                      key={props.columnsList[order].id}
                    >
                      {props.columnsList[order].name}
                    </Grid>
                  )}
                </Draggable>
              ))}
              {provider.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className={"settingControlSection"}>
        <Button
          variant={"contained"}
          onClick={() => props.toggleSettingsTab(!props.settingsTableDisplay)}
          className={"closeButton"}
        >
          Close
        </Button>
        <Button
          onClick={() => {
            !isEqual(props.columnsOrder, columnsOrder) &&
              props.updateColumnOrder(columnsOrder);
            props.updateColumnDisplay(visibleColumns);
          }}
          variant={"contained"}
          className={"applyButton"}
        >
          Apply Changes
        </Button>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
