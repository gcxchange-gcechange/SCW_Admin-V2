# scw-admin

## Summary

This webpart allows users to approve or reject community creation requests. It displays a list of requests that have been approved, rejected, failed and pending.
When the user selects an item from the list, the details of the request will display, along with madatory selection to approve or reject the request , as well as comments.

## Features

- When a request is submitted for the creation of a community space. We retrieve the information the user submitted using PNP Lists.
- Then information is then reviewed using Fluent UI TextField componenents in disabled format.
- Once the information is reviewed the user can approve or reject the request using a choice button and comments are also entered.
- When the user submits the decision an API call using Azure is used to send the information and update the list.

https://github.com/gcxchange-gcechange/SCW_Admin-V2/assets/62317607/8910b575-78f0-40ca-a3fb-ad35e4460b8e

## Compability / Compatibilité
![SPFx 1.17.1](https://img.shields.io/badge/SPFx-1.17.1-green.svg) 
![Node.js v16.14.0](https://img.shields.io/badge/Node.js-v16.14.0-green.svg)


## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)


## Contributors

- [@gabrielamoreno](https://github.com/gabmor38)

## Version history

| Version | Date             | Comments        |
| ------- | ---------------- | --------------- |
| 1.1     | March 10, 2021   | Update comment  |
| 1.0     | January 29, 2021 | Initial release |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp serve**


## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
