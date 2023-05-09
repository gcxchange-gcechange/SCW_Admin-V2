import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IScwAdminProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  context: WebPartContext;
}
