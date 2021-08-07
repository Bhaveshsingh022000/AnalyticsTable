import React, { useMemo, useEffect } from "react";
import DateRangePicker from "../CommonComponents/DateRangePicker/DateRangePicker";
import "./AnalyticsTable.scss";
import useSWR from "swr";
import { AppData, TableData } from "./AnalyticsTableDataTypes";
import { appDataFetcher, tableDataFetcher } from "./Fetcher/TableDataFetcher";
import { ColumnHeader } from "../CommonComponents/Table/TableDataTypes";
import Table from "../CommonComponents/Table/Table";
import { bindActionCreators, Dispatch } from "redux";
import { TablesSettingsState } from "../../Store/Reducers/TablesSettingsReducer";
import * as TableSettingsActions from "../../Store/Actions/TablesSettingsAction";
import { connect } from "react-redux";
import TuneIcon from "@material-ui/icons/Tune";
import { Button } from "@material-ui/core";
import NotFound from "../CommonComponents/NotFound/NotFound";
import { dateToMonthStringDate } from "../../Utils/Utils";

const mapStateToProps = (state: TablesSettingsState) => {
  return {
    columnsList: state.columnsList,
    columnsOrder: state.columnsOrder,
    settingsTableDisplay: state.showSettingsTab,
    startDate: state.startingDate,
    endDate: state.endingDate,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      toggleSettingsTab: TableSettingsActions.toggleSettingsTab,
      setEndDate: TableSettingsActions.updateEndingDate,
      setStartDate: TableSettingsActions.updateStartingDate,
    },
    dispatch
  );
};

type AnalyticsTableProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const AnalyticsTable: React.FC<AnalyticsTableProps> = (props) => {
  const { data } = useSWR<TableData[] | undefined>(
    () =>
      props.startDate && props.endDate
        ? `https://go-dev.greedygame.com/v3/dummy/report?startDate=${props.startDate}&endDate=${props.endDate}`
        : "",
    tableDataFetcher,
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
    }
  );

  const appData = useSWR<AppData[] | undefined>(
    () => `https://go-dev.greedygame.com/v3/dummy/apps`,
    appDataFetcher,
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    const params2 = new URLSearchParams(window.location.hash.split("?")[1]);
    const arrayOfParams = Array.from(params2.entries());
    if (arrayOfParams.length === 0) {
      return;
    }
    const data: any[] = [];
    arrayOfParams.forEach((item) => {
      data.push(JSON.parse(item[1]));
    });
    props.setStartDate(data[0].startDate);
    props.setEndDate(data[0].endDate);
  }, []);

  const tableData: TableData[] = useMemo(() => {
    const hashMap = new Map();
    appData.data?.forEach((app) => {
      if (!hashMap.has(app.id)) {
        hashMap.set(app.id, app.name);
      }
    });
    return data && data.length > 0
      ? data.map((item) => ({
          ...item,
          appName: hashMap.get(item.id),
        }))
      : [];
  }, [data, appData.data]);

  const renderColumnData = (
    data: TableData,
    column: ColumnHeader
  ): JSX.Element => {
    switch (column.name) {
      case "App":
        return (
          <td className={"textAlignLeft"} key={Math.random()}>
            {data.appName}
          </td>
        );
      case "Date":
        const date = new Date(data.date);
        return (
          <td
            className={"textAlignLeft"}
            key={Math.random()}
          >{dateToMonthStringDate(date)}</td>
        );
      case "Clicks":
        return (
          <td className={"textAlignLeft"} key={Math.random()}>
            {data.clicks.toLocaleString()}
          </td>
        );
      case "Impression":
        return (
          <td className={"textAlignLeft"} key={Math.random()}>
            {data.impressions.toLocaleString()}
          </td>
        );
      case "CTR":
        return (
          <td
            className={"textAlignLeft"}
            key={Math.random()}
          >{`${data.ctr.toFixed(2)}%`}</td>
        );
      case "Fill rate":
        return (
          <td
            className={"textAlignLeft"}
            key={Math.random()}
          >{`${data.fillRate.toFixed(2)}%`}</td>
        );
      case "Revenue":
        return (
          <td className={"textAlignLeft"} key={Math.random()}>{`${
            data.revenue && data.revenue.toFixed(2)
          }`}</td>
        );
      default:
        const content = data[column.dataField as keyof TableData];
        return (
          <td className={"textAlignLeft"} key={Math.random()}>
            {content.toLocaleString()}
          </td>
        );
    }
  };

  return (
    <div className={"mainContainer"}>
      <div className={"topSection"}>
        <DateRangePicker
          startDateValue={(value) => props.setStartDate(value)}
          endDateValue={(value) => props.setEndDate(value)}
          endDate={props.endDate}
          startDate={props.startDate}
        />
        <Button
          className={"settingsButton"}
          variant="contained"
          startIcon={<TuneIcon className={"settingsIcon"} />}
          onClick={() => props.toggleSettingsTab(!props.settingsTableDisplay)}
        >
          Settings
        </Button>
      </div>
      {tableData.length === 0 ? (
        <NotFound suggestionText={"Try selecting a different date"} />
      ) : (
        <Table
          tableData={tableData}
          renderColumnData={renderColumnData}
          showSettingsTab={props.settingsTableDisplay}
          appList={appData.data || []}
        />
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTable);
