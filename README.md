# scw-admin

## Summary

- This webpart allows users to approve or reject community creation requests. 

- It retrieves and displays data from the "Request" SharePoint list. This list contains community creation requests stored by [this function app](https://github.com/gcxchange-gcechange/appsvc-fnc-dev-scw-list.git) when initiated through this web part [this web part](https://github.com/gcxchange-gcechange/spfx-scw). 

- If the selected item from the list has a status value other than "Submitted," the request details will be displayed in a disabled format. Only one button link is provided to redirect back to the list of all requests. 
 
- If items with a status value of "Submitted" selected, the request details will appear in a disabled format. In this case, there is a mandatory selection to either approve or reject the request, an optional editable comments field, and two button links for submitting the decision and redirecting back to the list of all requests.

- Once the information is reviewed, the user can approve or reject the request with or without comments.

- When the user submits the decision, [this function app](https://github.com/gcxchange-gcechange/appsvc-fnc-dev-scw-list.git) is invoked to update the status and comment fields of the SharePoint list "Request". Additionally, if the decision is approved, a message is added to the queue named "site creation".

- Upon approval, the status field of the SharePoint list "Request" will change from "Submitted" to "Complete" and if it is rejected it will change into "Rejected".
## Prerequisites
- This web part connects to [this function app](https://github.com/gcxchange-gcechange/appsvc-fnc-dev-scw-list.git).

- The SharePoint list, named "Request" should be created and stored the community creation requests data by [this function app](https://github.com/gcxchange-gcechange/appsvc-fnc-dev-scw-list.git) when community creation requested via [this web part](https://github.com/gcxchange-gcechange/spfx-scw).

- The SharePoint list "Request" mentioned above should be in the same SharePoint site where this webpart is placed.

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