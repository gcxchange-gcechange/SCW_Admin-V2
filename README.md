# Name of the application

## Summary

This webpart allows users to approve or reject community creation requests. It displays a list of requests that have been approved, rejected, failed and pending.
When the user selects an item from the list, the details of the request will display, along with madatory selection to approve or reject the request , as well as comments.
- When a request is submitted for the creation of a community space. We retrieve the information the user submitted using PNP Lists.
- Then information is then reviewed using Fluent UI TextField componenents in disabled format.
- Once the information is reviewed the user can approve or reject the request using a choice button and comments are also entered.
- When the user submits the decision an API call using Azure is used to send the information and update the list.


## Prerequisites
This web part connects to [this function app](https://github.com/gcxchange-gcechange/appsvc-fnc-dev-userstats).

## API permission
List of api permission that need to be approve by a sharepoint admin.

## Version 
![SPFx 1.17.1](https://img.shields.io/badge/SPFx-1.17.1-green.svg) 
![Node.js](https://img.shields.io/badge/Node.js-v16.13+-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Version history

Version|Date|Comments
-------|----|--------
1.0|Aug 9, 2023|Initial release

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- In the command-line run:
  - **npm install**
  - **gulp serve**
- You will need to add your client id and azure function to the `clientId` and `url` classs members at the top of the filename.tsx file.
- To debug in the front end:
  - go to the `serve.json` file and update `initialPage` to `https://domain-name.sharepoint.com/_layouts/15/workbench.aspx`
  - Run the command **gulp serve**
- To deploy: in the command-line run
  - **gulp bundle --ship**
  - **gulp package-solution --ship**
- Add the webpart to your tenant app store
- Approve the web API permissions

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**