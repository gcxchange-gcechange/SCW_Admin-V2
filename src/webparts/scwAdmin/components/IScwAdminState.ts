/* eslint-disable @typescript-eslint/no-explicit-any */

import { WebPartContext } from "@microsoft/sp-webpart-base";



export interface IScwAdminState {
    context?: WebPartContext;
    selectedRowData: any;
    confirmationComments?:(value: string) => void;

}
