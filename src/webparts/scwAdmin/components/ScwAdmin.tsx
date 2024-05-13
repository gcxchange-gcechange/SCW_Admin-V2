/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import styles from './ScwAdmin.module.scss';
import { IScwAdminProps } from './IScwAdminProps';
import { getSP } from '../../../pnpjsConfig';
import { SPFI } from '@pnp/sp';
import '@pnp/sp/items';
import "@pnp/sp/items/get-all";
import { useEffect, useState  } from 'react';
import { DefaultButton,  DetailsList, 
  DetailsListLayoutMode, 
  DetailsRow, 
  IButtonStyles, 
  IColumn, 
  IDetailsColumnRenderTooltipProps, 
  IDetailsColumnStyles, 
  IDetailsHeaderProps, 
  IDetailsListProps, 
  IDetailsRowStyles, 
  IRenderFunction, 
  IScrollablePaneStyles, 
  IStackStyles, 
  IStackTokens, 
  Icon, 
  PrimaryButton, 
  ScrollablePane, 
  ScrollbarVisibility,  
  Spinner,  
  SpinnerSize,  
  Stack,  
  Sticky,  
  StickyPositionType,  
  TooltipHost, 
  mergeStyleSets } from 'office-ui-fabric-react';
import { PagedItemCollection } from '@pnp/sp/items';
import ItemFormDetails from './ItemFormDetails';
import { getTheme } from '@fluentui/react/lib/Styling';
import { HttpClientResponse, IHttpClientOptions, AadHttpClient }  from "@microsoft/sp-http";
import Complete from './Complete';
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode, PrimeReactProvider } from 'primereact/api';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from 'primereact/inputtext';


export interface ISCWList {
  id: number;
  spaceName: string;
  spaceNameFr: string;
  spaceDescription: string;
  spaceDescriptionFR: string;
  businessJustification: string;
  requesterEmail: string;
  requesterName: string;
  members: string;
  owner1: string;
  created: string;
  template: string;
  status: string;
  siteUrl: string;
  comment: string;
  approvedDate: string;
}

const ScwAdmin = (props: IScwAdminProps) => {

  const _sp:SPFI = getSP(props.context);
  const BATCH_SIZE = 500;

  const [requestList, setRequestList] = useState< ISCWList [] >( [] );
  const [selectedRowData, setSelectedRowData] = useState<any>();
  const [step, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isError, setIsError] = useState<number>(0);
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState<number>(1);
        const [globalFilterValue, setGlobalFilterValue] = useState("");


  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.CONTAINS },
    created: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    spaceName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    template: { value: null, matchMode: FilterMatchMode.IN },
    approvedDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
  }); 
  const onGlobalFilterChange = (e: any): void => {
    const value = e.target.value;
    const _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  }; 
  const columns: IColumn[] = [
    { key: 'Col0', name: 'ID', fieldName: 'id', minWidth: 40, maxWidth: 80},
    { key: 'Col1', name: 'Community Name', fieldName: 'spaceName', minWidth: 210, maxWidth: 400,  flexGrow: 1, isResizable: true },
    { key: 'Col2', name: 'Template', fieldName: 'template', minWidth: 100, maxWidth: 120},
    { key: 'Col3', name: 'Status', fieldName: 'status', minWidth: 100, maxWidth: 120, 
      onRender: (item) => {

        switch(item.status ) {
          case "Submitted":
              return (    
                <>  
                <span className={styles.iconStyle}>
                  <Icon iconName='SkypeCircleClock'/> 
                </span>
              {item.status}
              </>
              );
              
          case 'Approved':
              return (
                <>
                  <span className={styles.iconStyle}>
                    <Icon className={styles.approved} iconName='SkypeCircleCheck'/>
                  </span>
                  {item.status}
                </>
              );
         
          case  'Rejected':
              return (
              <>
              <span className={styles.iconStyle}>
                <Icon className={styles.rejected} iconName='StatusErrorFull'/>
              </span> 
              {item.status} 
              </>
              );
          
          case 'Failed':
              return (
                <>
                  <span className={ styles.iconStyle }>
                  <Icon className={ styles.failed } iconName='IncidentTriangle'/>
                  </span>
                  <span style={{color: 'red'}}>
                  {item.status}
                  </span>
                </>
              )  ;
          case 'Complete':
            return (
              <>
              <span className={ styles.iconStyle }>
              <Icon className={ styles.completed } iconName='VerifiedBrandSolid'/>
              </span>
              <span style={{color: '#106ebe'}}>
              {item.status}
              </span>
            </>
            );
            case 'Site Exists':
              return (
                <>
                  <span className={ styles.iconStyle }>
                  <Icon className={ styles.failed } iconName='IncidentTriangle'/>
                  </span>
                  <span style={{color: 'red'}}>
                  {item.status}
                  </span>
                </>
              );
              case 'No Owner':
                return (
                  <>
                    <span className={ styles.iconStyle }>
                    <Icon className={ styles.failed } iconName='IncidentTriangle'/>
                    </span>
                    <span style={{color: 'red'}}>
                    {item.status}
                    </span>
                  </>
                );
          default:
        }
      }
   },
    { key: 'Col4', name: 'Created Date', fieldName: 'created', minWidth: 70, maxWidth: 90 },
  ];
  const columns2 = [
    { field: "id", header: "ID" },
    { field: "spaceName", header: "Community Name" },
    { field: "template", header: "Template" },
    { field: "status", header: "Status" },
    { field: "created", header: "Created Date" },
    { field: "approvedDate", header: "Approved Date" },
  ];
 
  // const header = (
    
    
  // );
// const [templates] = useState(["Generic", "Generic Template", "Default"]);
// const templateItemTemplate = (option: any) => {
//   return (
//     <div>
//       <span>{option}</span>
//     </div>
//   );
// };
//   const templateRowFilterTemplate = (options: any) => {
//     return (
//       <MultiSelect
//         value={options.value}
//         options={templates}
//         itemTemplate={templateItemTemplate}
//         onChange={(e) => options.filterApplyCallback(e.value)}
//         //optionLabel={options.value}
//         placeholder="Any"
//         //className="p-column-filter"
//         maxSelectedLabels={1}
//         style={{ minWidth: "14rem" }}
//       />
//     );
//   };
 const getSeverity = (status: string): any => {
   switch (status) {
     case "Submitted":
       return "info";
     case "Approved":
       return "success";
     case "Complete":
       return "success";
     case "Site Exists":
       return "warning";
     case "No Owner":
       return "warning";
     case "Rejected":
       return "danger";
     case "Failed":
       return "danger";
     default:
       return null;
   }
 };
  const statusBodyTemplate = (requestList: ISCWList): JSX.Element => {
    return (
      <Tag
        value={requestList.status}
        severity={getSeverity(requestList.status)}
      />
    );
  };
  const [statuses] = useState([
    "Submitted",
    "Approved",
    "Complete",
    "Site Exists",
    "No Owner",
    "Rejected",
    "Failed",
  ]);
  const statusItemTemplate = (option: any): JSX.Element => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };
  const statusRowFilterTemplate = (options: any): JSX.Element => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Select One"
        // className="p-column-filter"
        showClear
        style={{ minWidth: "12rem" }}
      />
    );
  };

 const goToNextStep = (step:any):void => {
    const nextPage = step + 1;
    setCurrentStep(nextPage);
 }

  const goToPreviousStep = (step:any):void => {
    const previousPage = step - 1;
  
    setCurrentStep(previousPage);

  }
  
  const getList = async () => {
    
    let pagedItems: any[] = [];
    let items: PagedItemCollection<any[]> = undefined;

    do {
      if(!items) items = await _sp.web.lists
        .getById(props.list)
        .items.select(
          "ID",
          "Title",
          "SpaceNameFR",
          "SpaceDescription",
          "SpaceDescriptionFR",
          "RequesterName",
          "RequesterEmail",
          "Members",
          "Owner1",
          "BusinessJustification",
          "Created",
          "ApprovedDate",
          "Status",
          "TemplateTitle",
          "SiteUrl",
          "Comment"
        )
        .top(BATCH_SIZE)
        .orderBy("Status", false)
        .orderBy("Created", false)
        .getPaged();
      else items = await items.getNext();
      if ( items.results.length > 0 ) {
        pagedItems = pagedItems.concat(items.results);
      }
    } while (items.hasNext);  

    
    setRequestList((pagedItems).map((item) => {
      console.log("pagedItems", pagedItems);
      if(item.Comment === null ) {
        item.Comment = ''
      }

      return {
        id: item.ID,
        spaceName: item.Title,
        spaceNameFr: item.SpaceNameFR,
        spaceDescription: item.SpaceDescription,
        spaceDescriptionFR: item.SpaceDescriptionFR,
        requesterName: item.RequesterName,
        requesterEmail: item.RequesterEmail,
        members: item.Members,
        owner1: item.Owner1,
        businessJustification: item.BusinessJustification,
        created: new Date(item.Created).toLocaleDateString("en-CA"),
        approvedDate: new Date(item.ApprovedDate).toLocaleDateString("en-CA"),
        status: item.Status,
        template: item.TemplateTitle,
        siteUrl: item.SiteUrl,
        comment: item.Comment,
      };

    }))
     
  };   
  

  useEffect(() => {  
      getList();
      setLoading(false);
  }, [step,props])

  const theme = getTheme();

  const headerStyle: Partial<IDetailsColumnStyles> = {
    cellTitle: {
      position:  'sticky',
      fontSize: 14,
      fontWeight: 600
    }
  };

  const _onRenderRow: IDetailsListProps['onRenderRow'] = props => {
    const customStyles: Partial<IDetailsRowStyles> = {};
    if (props) {
      if (props.itemIndex % 2 === 0) {
        // Every other row renders with a different background color
        customStyles.root = { backgroundColor: `${theme}` };
      }

      return <DetailsRow {...props} styles={customStyles} />;
    }
    return null;
  };



  const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (props, defaultRender) => {
    if (!props) {
      return null;
    }
    const onRenderColumnHeaderTooltip: IRenderFunction<IDetailsColumnRenderTooltipProps> = tooltipHostProps => (
      <TooltipHost {...tooltipHostProps} />
    );
    return (
      <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced>
        {defaultRender?.({
          ...props,
          onRenderColumnHeaderTooltip,
        })}
      </Sticky>
    );
  }


  const onItemInvoked = (item: any) => {
    goToNextStep(step)
    setSelectedRowData(item);
  }



  const scrollStyles = mergeStyleSets ({
    wrapper: {
      height: '40vh',
      position: 'relative',
      backgroundColor: 'white',
      margin:'10px'
    },
    root: {
      height: '40vh',
      position: 'relative',
    }
  });



  const scrollablePaneStyles: Partial<IScrollablePaneStyles> = { root: scrollStyles.root };

  const buttonStyle: Partial<IButtonStyles> = {
    root: {backgroundColor: '#c0c0cc', color: '#004DB8', borderColor: '#c0c0cc'},
    rootHovered: { backgroundColor: '#c0c0cc' },
    rootFocused: { backgrounColor: '#c0c0cc!important'}
  } 



  const decisionChoiceCallback = (option: string): void => {

    if (option === 'A') {
      setSelectedRowData({
        ...selectedRowData,
        decisionStatus: 'Approved'
      })
    }
    else if(option ==='B') {
      setSelectedRowData({
        ...selectedRowData,
        decisionStatus: 'Rejected'
      })
    } else {
      setSelectedRowData({
        ...selectedRowData,
        decisionStatus: null
      })
    }

  }

  const confirmationComments = (value: string):void => {

      if (value ) {
      setSelectedRowData({
        ...selectedRowData,
        comment: value
      });

    } 
  
  }

  const onConfirm = ():void  => {
    const isApproved = selectedRowData.decisionStatus === "Approved";
    const hasValidComment = selectedRowData.comment.length >= 5 || selectedRowData.comment === "";
    const isRejected = selectedRowData.decisionStatus === "Rejected";
    const hasNonEmptyComment = selectedRowData.comment !== "";

    if ((isApproved && (hasValidComment || selectedRowData.comment === "")) || (isRejected && hasNonEmptyComment)) {  
    
      const functionUrl: string = '';


      const requestHeaders: Headers = new Headers();
          requestHeaders.append("Content-type", "application/json");
          requestHeaders.append("Cache-Control", "no-cache");
          const postOptions: IHttpClientOptions = {
              headers: requestHeaders,
              body: `
                  {
                    "Id": "${selectedRowData.id}",
                    "Status": "${selectedRowData.decisionStatus}", 
                    "Comment": "${selectedRowData.comment}"    
              }`
          };
          
           setIsLoading(true); 
  
            props.context.aadHttpClientFactory.getClient('')
              .then((client: AadHttpClient) => {
                client
                  .post(functionUrl, AadHttpClient.configurations.v1, postOptions)
                  .then((response: HttpClientResponse) => {
                    console.log(`RESPONSE:`, response);
                    console.log(`Status code:`, response.status);
                      console.log('response is ', response.ok);
                    if (response.status === 200 ) {  
                      setIsLoading(false);
                      setIsError(response.status);
                      setShowModal((prev) => !prev);
                    } else {
                      setIsLoading(false);
                      setIsError(response.status);
                      setShowModal(true);
                    }
                    
                  })   
              })
              
              .catch((response: any) => {
                      
                const errMsg: string = `HELLO WARNING - error when calling URL ${functionUrl}. ERROR = ${response.message}`;
                console.log("err is: ", errMsg);
              });
    }
     else {
      setShowModal((prev) => !prev);
     }
                
    
  }

  const closeModal = ():void => {
 
    setShowModal(false);

    if (selectedRowData.decisionStatus){
      setCurrentStep(step - 1);
    }
    
  }

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement> ):void => {
    console.log("What DId I type",event.target.value)
    setSearchInput(event.target.value.toLowerCase());

  }

  const getPage = (page: number):void  =>  {
    console.log(page);
    setPage(page)
  } 
  
  const sectionStackTokens: IStackTokens = { childrenGap: 10 };

  const stackStyles: IStackStyles = {
    root: {
      marginTop:'18px'
    },
  };

  const startIndex:number = (page - 1) * 100;
  const endIndex: number = Math.min(startIndex + 100, requestList.length);
  const displayItemsPerPage = requestList.slice(startIndex, endIndex);

  // const searchItems = displayItemsPerPage.map((item) => {
  //   return {
  //     id: item.id, 
  //     spaceName: item.spaceName,
  //     spaceNameFr: item.spaceNameFr,
  //     owner: item.owner1,
  //     requestorEmail: item.requesterEmail,
  //     requestorName: item.requesterName

  //   }
  // })

  //console.log("SI",searchItems)

  const searchItemsDisplay = searchInput 
  ? displayItemsPerPage.filter(item => 
      Object.entries(item).some(([key, val]) => 
          ['id', 'spaceName', 'spaceNameFr', 'owner1', 'requesterEmail', 'requesterName','status']
          .includes(key) &&
          val.toString().toLowerCase().includes(searchInput.toLowerCase())
      )
    )
    : displayItemsPerPage;

console.log(searchItemsDisplay);


  // const searchItemsDisplay =  searchInput ? displayItemsPerPage.filter(item => 

  //   Object.values(item).some(val => 
  //       typeof val === 'string' && val.toLowerCase().includes(searchInput.toLowerCase())
  //   )
  // ) : displayItemsPerPage
const renderHeader = (): JSX.Element => {
  return (
    <>
      {" "}
      <div className="flex justify-content-start">
        <h2>SCW communities requests</h2>
      </div>      
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </IconField>
      </div>
    </>
  );
};
const header = renderHeader();


  return (
    <>
      <div className={styles.container}>
        {step === 1 && (
          <>
            {/* <div className={styles.search}>
              <span>
                <Icon className={styles.searchIcon} iconName="Search" />
              </span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search"
                onChange={handleSearchInput}
                value={searchInput}
              />
            </div>
            <div>
              <Pagination
                currentPage={1}
                totalPages={
                  searchInput
                    ? Math.ceil(searchItemsDisplay.length / 100)
                    : Math.ceil(requestList.length / 100)
                }
                onChange={(page) => getPage(page)}
                limiter={3} // Optional - default value 3
                hideFirstPageJump // Optional
                hideLastPageJump // Optional
              />
            </div>
            <ScrollablePane
              scrollbarVisibility={ScrollbarVisibility.auto}
              styles={scrollablePaneStyles}>
              <DetailsList
                styles={headerStyle}
                items={searchItemsDisplay}
                columns={columns}
                layoutMode={DetailsListLayoutMode.justified}
                onRenderRow={_onRenderRow}
                isHeaderVisible={true}
                onRenderDetailsHeader={onRenderDetailsHeader}
                onItemInvoked={onItemInvoked}
              />
            </ScrollablePane> */}

            <section className={`${styles.dataTable}`}>
              <div className={`${styles.card}`}>
                <PrimeReactProvider>
                  <DataTable
                    value={requestList}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50, 500]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
                    dataKey="id"
                    loading={loading}
                    filters={filters}
                    filterDisplay="row"
                    globalFilterFields={[
                      "id",
                      "status",
                      "created",
                      "spaceName",
                      "requesterName",
                      "requesterEmail",
                      "template",
                      "approvedDate",
                    ]}
                    emptyMessage="No data found."
                    scrollable
                    sortField="created"
                    sortOrder={-1}
                    removableSort
                    stripedRows
                    header={header}
                    selectionMode="single"
                    selection={selectedRowData}
                    onSelectionChange={(e: any) => setSelectedRowData(e.value)}
                    onRowSelect={onItemInvoked}>
                    {columns2.map((col: any, i: any) =>
                      col.field === "status" ? (
                        <Column
                          sortable
                          field="status"
                          header="Status"
                          showFilterMenu={false}
                          //filterMenuStyle={{ width: "14rem" }}
                          style={{ minWidth: "12rem" }}
                          body={statusBodyTemplate}
                          filter
                          filterElement={statusRowFilterTemplate}
                        />
                      ) : col.field === "created" ||
                        col.field === "approvedDate" ? (
                        <Column
                          sortable
                          key={col.field}
                          field={col.field}
                          header={col.header}
                          style={{ minWidth: "12rem" }}
                          filter
                          filterPlaceholder="Search"
                          filterMenuStyle={{ minWidth: "25rem" }}
                        />
                      ) : (
                        <Column
                          sortable
                          key={col.field}
                          field={col.field}
                          header={col.header}
                        />
                      )
                    )}
                  </DataTable>
                </PrimeReactProvider>
              </div>
            </section>
          </>
        )}

        {isLoading === true ? (
          <Spinner size={SpinnerSize.large} />
        ) : (
          step === 2 && (
            <>
              <ItemFormDetails
                selectedRowData={selectedRowData}
                confirmationComments={confirmationComments}
                context={props.context}
                decisionChoiceCallback={decisionChoiceCallback}
                requestList={requestList}
              />

              <Stack
                horizontal
                horizontalAlign="center"
                tokens={sectionStackTokens}
                styles={stackStyles}>
                {selectedRowData.status === "Submitted" ? (
                  <>
                    <DefaultButton
                      styles={buttonStyle}
                      text="Previous"
                      onClick={() => goToPreviousStep(step)}
                    />
                    <PrimaryButton
                      text={"Submit decision"}
                      onClick={onConfirm}
                    />
                  </>
                ) : (
                  <PrimaryButton
                    text="Back to Communities List Page"
                    onClick={() => goToPreviousStep(step)}
                  />
                )}
              </Stack>
            </>
          )
        )}
        {showModal && (
          <Complete
            data={selectedRowData.id}
            spaceName={selectedRowData.spaceName}
            spaceNameFr={selectedRowData.spaceNameFr}
            status={selectedRowData.decisionStatus}
            comment={selectedRowData.comment}
            showModal={showModal}
            onClose={closeModal}
            isError={isError}
          />
        )}
      </div>
    </>
  );


}

export default ScwAdmin


