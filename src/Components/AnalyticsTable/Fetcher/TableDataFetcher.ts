import axios, { AxiosResponse } from "axios";
import { AppData, TableData } from "../AnalyticsTableDataTypes";


export const tableDataFetcher = (url: string): Promise<TableData[]> | undefined =>
  url
    ? axios
        .get<any, AxiosResponse<TableData[]>>(url)
        .then((res: any): TableData[] => {
          return res.data.data.map((item: any) => {
            return {
              id: item.app_id,
              clicks: item.clicks,
              impressions: item.impressions,
              requests: item.requests,
              responses: item.responses,
              revenue: item.revenue,
              date: item.date,
              fillRate: (item.requests * 100) / item.responses ,
              ctr: (item.clicks * 100) / item.impressions ,
              appName: "",
            };
          });
        })
    : undefined;



export const appDataFetcher = (url: string): Promise<AppData[]> | undefined =>
  url
    ? axios
        .get<any, AxiosResponse<AppData[]>>(url)
        .then((res: any): AppData[] => {
          return res.data.data.map((item: any) => {
            return {
              id: item.app_id,
              name: item.app_name,
            };
          });
        })
    : undefined;