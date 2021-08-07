import React from "react";
import { IconButton, Button } from "@material-ui/core";
import "./Table.scss";
import { orderBy, isEqual, isEmpty, pickBy, isBoolean } from "lodash";
import SettingsView from "./SettingsView/SettingsView";
import {
  convertToInternationalCurrencySystem,
  dateFilterValidation,
  filterColumnOnRange,
  getMaxValuesOfColumns,
} from "../../../Utils/Utils";
import { ColumnHeader } from "./TableDataTypes";
import {
  AppData,
  TableData,
} from "../../AnalyticsTable/AnalyticsTableDataTypes";

import RangeFilterPopup from "./RangeFilterPopup";
import NameFilterPopup from "./NameFilterpopup";
import DateFilterPopup from "./DateFilterPopup";
import FilterListIcon from "@material-ui/icons/FilterList";
import NotFound from "../NotFound/NotFound";
import { connect } from "react-redux";
import { TablesSettingsState } from "../../../Store/Reducers/TablesSettingsReducer";
import { bindActionCreators, Dispatch } from "redux";
import * as TableSettingsActions from "../../../Store/Actions/TablesSettingsAction";
import AlertMessage from "../AlertMessage/AlertMessage";
import ShareIcon from "@material-ui/icons/Share";
import moment from "moment";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

type TableProps = {
  tableData: TableData[];
  renderColumnData: (data: TableData, column: ColumnHeader) => void;
  showSettingsTab: boolean;
  appList: AppData[];
};

type TableState = {
  anchorElement: any;
  activeFilters: Record<number, boolean>;
  tableData: TableData[];
  sortedColumn: Record<string, boolean | undefined>;
  columnFilterRange: Record<number, number[]>;
  dateFilterType: number;
  filterDate: string;
  selectedNamesToFilter: Record<number, boolean>;
  showRangeFilterPopup: boolean;
  showNameFilterPopup: boolean;
  showDateFilterPopup: boolean;
  activeRangeFilter: {
    id: number;
    dataField: string;
  };
  rangeMaxValues: Record<string, number>;
  showLinkCopiedMessage: boolean;
};

const mapStateToProps = (state: TablesSettingsState, ownProps: TableProps) => {
  return {
    columnHeaders: state.columnsList,
    columnOrder: state.columnsOrder,
    settingsTableDisplay: state.showSettingsTab,
    startDate: state.startingDate,
    endDate: state.endingDate,
    ...ownProps,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      updateColumnDisplay: TableSettingsActions.updateColumnDisplay,
      updateColumnOrder: TableSettingsActions.updateColumnOrder,
      toggleSettingsTab: TableSettingsActions.toggleSettingsTab,
      setStartDate: TableSettingsActions.updateStartingDate,
      setendDate: TableSettingsActions.updateEndingDate,
    },
    dispatch
  );
};

type TableViewProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class Table extends React.Component<TableViewProps, TableState> {
  constructor(props: TableViewProps) {
    super(props);
    this.state = {
      anchorElement: null,
      activeFilters: {},
      tableData: [],
      sortedColumn: {},
      columnFilterRange: {},
      dateFilterType: -1,
      filterDate: "",
      selectedNamesToFilter: {},
      showRangeFilterPopup: false,
      showNameFilterPopup: false,
      showDateFilterPopup: false,
      activeRangeFilter: {
        id: -1,
        dataField: "",
      },
      rangeMaxValues: getMaxValuesOfColumns(props.tableData),
      showLinkCopiedMessage: false,
    };
  }

  filterDataBasedOnLink(data: any) {
    const filtersList: Record<number, boolean> = {};
    this.props.columnHeaders.forEach((column) => {
      filtersList[column.id] = false;
    });
    const rangeList: Record<number, number[]> = {};
    this.props.columnHeaders.forEach((item) => {
      rangeList[item.id] = [0, this.state.rangeMaxValues[item.dataField] || 0];
    });
    this.setState(
      {
        activeFilters: filtersList,
        columnFilterRange: data.ranges,
        tableData: this.props.tableData,
        selectedNamesToFilter: data.nameFilters,
        filterDate: data.filterDate,
        dateFilterType: data.dateFilterType,
      },
      () => {
        this.filterTable(false, false, Object.keys(data.sorting)[0]);
        this.props.updateColumnOrder(data.order);
        this.props.updateColumnDisplay(data.visibleColumns);
      }
    );
  }

  componentDidMount() {
    const params2 = new URLSearchParams(window.location.hash.split("?")[1]);
    const arrayOfParams = Array.from(params2.entries());

    if (arrayOfParams.length > 0) {
      const data: any[] = [];
      arrayOfParams.forEach((item) => {
        data.push(JSON.parse(item[1]));
      });
      this.filterDataBasedOnLink(data[0]);
      return;
    }
    const filtersList: Record<number, boolean> = {};
    this.props.columnHeaders.forEach((column) => {
      filtersList[column.id] = false;
    });
    const rangeList: Record<number, number[]> = {};
    this.props.columnHeaders.forEach((item) => {
      rangeList[item.id] = [0, this.state.rangeMaxValues[item.dataField] || 0];
    });
    this.setState({
      activeFilters: filtersList,
      columnFilterRange: rangeList,
      tableData: this.props.tableData,
    });
  }

  sortListBasedOnColumn = (fieldName: string) => {
    if (!fieldName) {
      return;
    }
    const sortedColumnObject: Record<string, boolean | undefined> = {
      ...(this.state.sortedColumn as object),
    };
    Object.keys(sortedColumnObject).forEach((key) => {
      sortedColumnObject[key] = undefined;
    });

    this.setState((prevState) => {
      if (prevState.sortedColumn[fieldName] === undefined) {
        sortedColumnObject[fieldName] = true;
        return {
          ...prevState,
          sortedColumn: sortedColumnObject,
          tableData: orderBy(prevState.tableData, [fieldName], ["asc"]),
        };
      }
      if (prevState.sortedColumn[fieldName]) {
        sortedColumnObject[fieldName] = false;
        return {
          ...prevState,
          sortedColumn: sortedColumnObject,
          tableData: orderBy(prevState.tableData, [fieldName], ["desc"]),
        };
      }
      if (!prevState.sortedColumn[fieldName]) {
        sortedColumnObject[fieldName] = undefined;
        return {
          ...prevState,
          sortedColumn: sortedColumnObject,
          tableData: orderBy(prevState.tableData, ["date"], ["asc"]),
        };
      }
      return prevState;
    });
    console.log("sotred");
  };

  handleClick = (event: any, colId: number) => {
    const stateClone = { ...this.state.activeFilters };

    Object.keys(stateClone).forEach((key: any) => {
      stateClone[key] = false;
    });

    if (this.state.activeFilters[colId]) {
      stateClone[colId] = false;
      this.setState({
        activeFilters: stateClone,
      });

      return;
    }
    stateClone[colId] = true;
    this.setState({
      activeFilters: stateClone,
    });
  };

  handleRangeReset = () => {
    if (
      isEqual(this.state.columnFilterRange[this.state.activeRangeFilter.id], [
        0,
        this.state.rangeMaxValues[this.state.activeRangeFilter.dataField],
      ])
    ) {
      this.setState({
        activeRangeFilter: {
          dataField: "",
          id: -1,
        },
        showRangeFilterPopup: false,
      });
      return;
    }
    const stateClone = { ...this.state.columnFilterRange };
    stateClone[this.state.activeRangeFilter.id] = [
      0,
      this.state.rangeMaxValues[this.state.activeRangeFilter.dataField] || 0,
    ];
    this.setState(
      {
        activeRangeFilter: {
          dataField: "",
          id: -1,
        },
        showRangeFilterPopup: false,
        columnFilterRange: stateClone,
      },
      () => this.filterTable()
    );
  };

  filteredColumns = (data: TableData[]) => {
    if (!this.state.columnFilterRange) {
      return data;
    }

    return filterColumnOnRange(
      data,
      this.props.columnHeaders,
      this.state.columnFilterRange
    );
  };

  filterByDate = (data: TableData[]) => {
    if (this.state.dateFilterType === -1 || this.state.filterDate === "") {
      return data;
    }
    const date = new Date(this.state.filterDate);

    return data.filter((item) =>
      dateFilterValidation(this.state.dateFilterType, date, new Date(item.date))
    );
  };

  filterByName = (data: TableData[]) => {
    if (isEmpty(this.state.selectedNamesToFilter)) {
      return data;
    }
    return data.filter((item) => this.state.selectedNamesToFilter[item.id]);
  };

  handleNamesToFilter = (id: number, value: boolean) => {
    const stateClone = { ...this.state.selectedNamesToFilter };
    stateClone[id] = value;
    this.setState({
      selectedNamesToFilter: stateClone,
    });
  };

  filterTable = (resetName = false, resetDate = false, sort = "") => {
    const a = !resetName ? this.filterByName(this.props.tableData) : [];
    const b = !resetDate
      ? this.filterByDate(a.length === 0 ? this.props.tableData : a)
      : [];

    const c = this.filteredColumns(
      b.length === 0 && resetDate ? this.props.tableData : b
    );

    this.setState(
      {
        tableData: c,
      },
      () => sort && this.sortListBasedOnColumn(sort)
    );
  };

  generateAndCopyShareLink() {
    const columnsVisiability: Record<number, boolean> = {};
    this.props.columnHeaders.forEach((item) => {
      columnsVisiability[item.id] = item.isAdded;
    });
    const data = {
      order: this.props.columnOrder,
      ranges: this.state.columnFilterRange,
      visibleColumns: columnsVisiability,
      nameFilters: this.state.selectedNamesToFilter,
      sorting: pickBy(this.state.sortedColumn, isBoolean),
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      filterDate: this.state.filterDate,
      dateFilterType: this.state.dateFilterType,
    };
    const shareAbleUrl = new URL(`${window.location.origin}/table`);
    const params = new URLSearchParams();
    params.set("data", JSON.stringify(data));
    shareAbleUrl.hash = `?${params.toString()}`;
    window.navigator.clipboard.writeText(shareAbleUrl.href);
    this.setState({ showLinkCopiedMessage: true });
  }

  shareLinkButton = (
    <Button
      className={"primaryButton"}
      variant={"contained"}
      onClick={() => this.generateAndCopyShareLink()}
      startIcon={<ShareIcon />}
    >
      share link
    </Button>
  );

  onOpenFilterPopup = (
    columnId: number,
    filterType: string,
    anchorElement: any,
    dataField: string
  ) => {
    if (filterType === "range") {
      this.setState({
        showDateFilterPopup: false,
        showNameFilterPopup: false,
        showRangeFilterPopup: true,
        activeRangeFilter: {
          id: columnId,
          dataField: dataField,
        },
        anchorElement: anchorElement,
      });
    }
    if (filterType === "name") {
      this.setState({
        showDateFilterPopup: false,
        showNameFilterPopup: true,
        showRangeFilterPopup: false,

        anchorElement: anchorElement,
      });
    }
    if (filterType === "date") {
      this.setState({
        showDateFilterPopup: true,
        showNameFilterPopup: false,
        showRangeFilterPopup: false,

        anchorElement: anchorElement,
      });
    }
  };

  handleRangeFilterValueChange = (newValue: any) => {
    const stateClone = { ...this.state.columnFilterRange };
    stateClone[this.state.activeRangeFilter.id] = newValue;
    this.setState({
      columnFilterRange: stateClone,
    });
  };

  render() {
    return (
      <div>
        <AlertMessage
          isOpen={this.state.showLinkCopiedMessage}
          toggle={(value) => this.setState({ showLinkCopiedMessage: value })}
        />

        {this.props.showSettingsTab && <SettingsView />}
        <RangeFilterPopup
          anchorElement={this.state.anchorElement}
          isOpen={this.state.showRangeFilterPopup}
          maxValue={
            this.state.rangeMaxValues[this.state.activeRangeFilter.dataField]
          }
          minValue={0}
          onApplyChanges={() => {
            this.setState(
              {
                showRangeFilterPopup: false,
                activeRangeFilter: {
                  dataField: "",
                  id: -1,
                },
              },
              () => this.filterTable()
            );
          }}
          onChange={this.handleRangeFilterValueChange}
          onReset={() => this.handleRangeReset()}
          value={
            this.state.columnFilterRange &&
            this.state.activeRangeFilter.id !== -1
              ? this.state.columnFilterRange[this.state.activeRangeFilter.id]
              : 0
          }
        />
        <NameFilterPopup
          onSelectNames={this.handleNamesToFilter}
          values={this.state.selectedNamesToFilter}
          anchorElement={this.state.anchorElement}
          isOpen={this.state.showNameFilterPopup}
          onApplyChanges={() => {
            this.setState(
              {
                showNameFilterPopup: false,
              },
              () => this.filterTable()
            );

            return;
          }}
          namesList={this.props.appList}
          onReset={() => {
            this.setState(
              {
                showNameFilterPopup: false,
                selectedNamesToFilter: {},
              },
              () => this.filterTable(true, false)
            );

            return;
          }}
        />
        <DateFilterPopup
          anchorElement={this.state.anchorElement}
          isOpen={this.state.showDateFilterPopup}
          onApplyChanges={() => {
            this.filterTable();
            this.setState({
              showDateFilterPopup: false,
            });
          }}
          dateValue={this.state.filterDate}
          filterType={this.state.dateFilterType}
          onDateValueChange={(value) =>
            this.setState({
              filterDate: value,
            })
          }
          onFilterTypeChange={(value) =>
            this.setState({
              dateFilterType: value,
            })
          }
          onReset={() => {
            this.setState(
              {
                dateFilterType: -1,
                filterDate: "",
                showDateFilterPopup: false,
              },
              () => this.filterTable(false, true)
            );
            return;
          }}
        />

        {this.shareLinkButton}
        <table className={"table"}>
          <thead>
            <tr>
              {this.props.columnOrder.map(
                (order) =>
                  this.props.columnHeaders[order].isAdded && (
                    <th key={order}>
                      <div
                        style={{
                          alignItems: this.props.columnHeaders[order].textAlign,
                        }}
                        className={"tableHeader"}
                      >
                        <IconButton
                          color="primary"
                          className={
                            this.state.activeFilters[
                              this.props.columnHeaders[order].id
                            ]
                              ? "activeFilter"
                              : ""
                          }
                          component="span"
                          onClick={(event: any) =>
                            this.onOpenFilterPopup(
                              this.props.columnHeaders[order].id,
                              this.props.columnHeaders[order].filterType,
                              event.currentTarget,
                              this.props.columnHeaders[order].dataField
                            )
                          }
                        >
                          <FilterListIcon />
                        </IconButton>

                        <span
                          className={"tableHeaderTitle"}
                          onClick={() =>
                            this.sortListBasedOnColumn(
                              this.props.columnHeaders[order].dataField
                            )
                          }
                        >
                          {this.props.columnHeaders[order].name}{" "}
                          {this.state.sortedColumn[
                            this.props.columnHeaders[order].dataField
                          ] === false && <ArrowDownwardIcon />}
                          {this.state.sortedColumn[
                            this.props.columnHeaders[order].dataField
                          ] && <ArrowUpwardIcon />}
                        </span>
                        <span
                          onClick={() =>
                            this.sortListBasedOnColumn(
                              this.props.columnHeaders[order].dataField
                            )
                          }
                          className={"tableHeaderFigures"}
                        >
                          {this.props.columnHeaders[order].filterType ===
                            "range" &&
                            convertToInternationalCurrencySystem(
                              this.state.rangeMaxValues[
                                this.props.columnHeaders[order].dataField
                              ]
                            )}
                          {this.props.columnHeaders[order].filterType ===
                            "name" && this.props.appList.length}
                          {this.props.columnHeaders[order].filterType ===
                            "date" &&
                            moment(this.props.endDate).diff(
                              this.props.startDate,
                              "days"
                            )}
                        </span>
                      </div>
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {this.state.tableData.length === 0 ? (
              <tr>
                <td colSpan={this.props.columnHeaders.length}>
                  <NotFound suggestionText={"Try changing the filters"} />
                </td>
              </tr>
            ) : (
              this.state.tableData.map((item) => (
                <tr key={item.id * Math.random()}>
                  {this.props.columnOrder.map(
                    (order) =>
                      this.props.columnHeaders[order].isAdded &&
                      this.props.renderColumnData(
                        item,
                        this.props.columnHeaders[order]
                      )
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
