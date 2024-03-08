# Name of the application

## Summary

- This webpart allows users to approve or reject community creation requests. 
- It retrive and display the data from the SharePoint list called Request where the community creation requests data stored by the [fuction app](https://github.com/gcxchange-gcechange/appsvc-fnc-dev-scw-list.git) when community creation requested via the [spfx-scw web part](https://github.com/gcxchange-gcechange/spfx-scw). 
- When the user selects an item from the list that has status value of submitted, the details of the request will display in disabled format, along with madatory selection to approve or reject the request, optional editable comments field and two button links to submit the decision and redirect back to the the list of all the requests.
- When the user selects an item from the list that has status value other than submitted, the details of the request will display in disabled format, along with only one button link that redirect back to the list of all the requests. 
- Once the information is reviewed, the user can approve or reject the request with or without comments.
- When the user submits the decision, the [function app](https://github.com/gcxchange-gcechange/appsvc-fnc-dev-scw-list.git) will be called to update the status and comment fields of the Request list and to add a message to the queue called site creation if the decision is approved.
- If the request approved, the status field of the SharePoint list Request List will change from Submitted to Complete and if it is rejected, it will change into Rejected.

## Prerequisites
- This web part connects to [this function app](https://github.com/gcxchange-gcechange/appsvc-fnc-dev-scw-list.git).
- The SharePoint list called Request should be created and stored the community creation requests data by the [fuction app](https://github.com/gcxchange-gcechange/appsvc-fnc-dev-scw-list.git) when community creation requested via the [spfx-scw web part](https://github.com/gcxchange-gcechange/spfx-scw).
- The SharePoint list Request mentioned above should be in the same SharePoint site where this webpart is placed.

## API permission
dgcx_dev_appreg_scw2_auth - user_impersonation

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
- To install the dependencies, in the command-line run:
  - **npm install**
- To debug in the front end:
  - go to the `serve.json` file and update `initialPage` to `https://your-domain-name.sharepoint.com/_layouts/15/workbench.aspx`
  - In the command-line run:
    - **gulp serve**
- To deploy:
  - In the command-line run:
    - **gulp clean**
    - **gulp bundle --ship**
    - **gulp package-solution --ship**
  - Add the webpart to your tenant app store
- Approve the web API permissions
- Add the Webpart to a page

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**