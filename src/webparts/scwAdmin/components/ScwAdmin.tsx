/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
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
 

}




const ScwAdmin = (props: IScwAdminProps) => {

  const LIST_NAME: string = 'Request';
  const _sp:SPFI = getSP(props.context);
  const BATCH_SIZE = 10;

  const [requestList, setRequestList] = useState< ISCWList [] >( [] );
  const [selectedRowData, setSelectedRowData] = useState<any>();
  const [step, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [close, setClose] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
    // const [ pageNumber, setPageNumber ] = useState< number >(0);
  // const [checked, setChecked ] = useState<boolean>(false);
  // const [selectedButton, setSelectedButton ] = useState<string>(null);
  

  const columns: IColumn[] = [
    { key: 'Col0', name: 'Id', fieldName: 'id', minWidth: 20},
    { key: 'Col1', name: 'Community Name', fieldName: 'spaceName', minWidth: 200, maxWidth: 400, isResizable: true },
    { key: 'Col2', name: 'Reason', fieldName: 'businessJustification', minWidth: 100, maxWidth: 400, isResizable: true },
    { key: 'Col3', name: 'Template', fieldName: 'template', minWidth: 100 },
    { key: 'Col4', name: 'Status', fieldName: 'status', minWidth: 100 },
    { key: 'Col5', name: 'Created Date', fieldName: 'created', minWidth: 100 },
  ];
  

 const goToNextStep = (step:any):void => {
    const nextPage = step + 1;
    console.log("NP", nextPage);
    setCurrentStep(nextPage);
 }

  const goToPreviousStep = (step:any):void => {
    const previousPage = step - 1;
    
    // setSelectedRowData({
    //   ...selectedRowData,
    //   status: 'Submitted'
    // })
    setCurrentStep(previousPage);

    console.log("previous", previousPage);
  }
  
  const getList = async () => {
    console.log("step", step)
    let pagedItems: any[] = [];
    // let pageNumber: number = 0;
    let items: PagedItemCollection<any[]> = undefined;

    do {
      if(!items) items = await _sp.web.lists.getByTitle(LIST_NAME).items.top(BATCH_SIZE).orderBy("Created", false).orderBy("Status",false).getPaged();
      else items = await items.getNext();

      if ( items.results.length > 0 ) {
        // console.log("we got results");
        // pageNumber ++;
        // console.log("PN", pageNumber)
        pagedItems = pagedItems.concat(items.results);
      }
    } while (items.hasNext);  

    // setPageNumber(pageNumber);
    
    setRequestList((pagedItems).map((item) => {
      return {
        id: item.ID,
        spaceName: item.Title,
        spaceNameFr: item.SpaceNameFr,
        spaceDescription: item.SpaceDescription,
        spaceDescriptionFR: item.SpaceDescription,
        requesterName: item.RequesterName,
        requesterEmail: item.RequesterEmail,
        members: item.Members,
        owner1: item.Owner1,
        businessJustification: item.BusinessJustification,
        created: new Date(item.Created).toLocaleDateString("en-CA"),
        status: item.Status,
        template: item.Template,
        siteUrl: item.SiteUrl,
      }

    }))
     
  };
    
  

  useEffect(() => {

      getList();


  }, [step])

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

  // const arrowIcon:IIconProps = {iconName: 'NavigateBack'};
  // const acceptIcon: IIconProps = { iconName: 'Accept'};


  const buttonStyle: Partial<IButtonStyles> = {
    root: {backgroundColor: '#c0c0cc', color: '#004DB8', borderColor: '#c0c0cc'},
    rootHovered: { backgroundColor: '#c0c0cc' }
  }



  const decisionChoiceCallback = (option: string): void => {
    console.log("O",option);
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
    }

  }
  

  // const handleApproveRejectButton = (event: any ):void => {
  //   const selectedBtnName: string = event.target.textContent;
  //   console.log("ev", selectedBtnName);
 
  //   setSelectedButton(selectedBtnName);
    
  //   if( selectedBtnName === 'Approve') {
  //     setSelectedRowData({
  //       ...selectedRowData,
  //       status: 'Approved'
  //     })

  //     setChecked((prev) => !prev)
  //   }
  //   else if ( selectedBtnName === 'Reject' ) {
  //     setSelectedRowData({
  //       ...selectedRowData,
  //       status: 'Rejected'
        
  //     })

  //     setChecked((prev) => !prev)
  //   }
     

  //     console.log("4",selectedRowData);
  

  //    goToNextStep(step)
     
  //  }




  const confirmationComments = (value: string):void => {
      console.log("value", value);

    setSelectedRowData({
      ...selectedRowData,
      decisionComment: value
    })
    
    console.log("state", selectedRowData)
  }

  
  const onConfirm = ():void  => {

    const functionUrl: string = 'https://appsvc-fnc-dev-scw-list-dotnet001.azurewebsites.net/api/CreateQueue';

    const requestHeaders: Headers = new Headers();
        requestHeaders.append("Content-type", "application/json");
        requestHeaders.append("Cache-Control", "no-cache");
        const postOptions: IHttpClientOptions = {
            headers: requestHeaders,
            body: `
                {
                  "Id": "${selectedRowData.id}",
                  "Status": "${selectedRowData.decisionStatus}", 
                  "Comment": "${selectedRowData.decisionComment}"    
                }`
        };

        setIsLoading((prev) => !prev);
        

        props.context.aadHttpClientFactory.getClient('ffbdb74a-7e0c-48a2-b460-2265ae3eb634')
          .then((client: AadHttpClient) => {
            client
              .post(functionUrl, AadHttpClient.configurations.v1, postOptions)
              .then((response: HttpClientResponse) => {
                console.log(`Status code:`, response.status);
                console.log('respond is ', response.ok);
              });

          })

          setIsLoading((prev) => !prev)

          console.log("Modal", showModal)
          setShowModal((prev) => !prev);
    
  }

  const closeModal = ():void => {

    const backToList = step - 1;
    setCurrentStep(backToList)
    setShowModal(false);
 
    console.log('stateon CLose', selectedRowData);
    console.log('steponClose', step);
    
  }
  
  const sectionStackTokens: IStackTokens = { childrenGap: 10 };

  const stackStyles: IStackStyles = {
    root: {
      marginTop:'18px'
    },
  };


  return (
    <>
    <div className={styles.container}>
      
      { step === 1 &&
      <>
      <h2>SCW Approvals</h2>
      <h3>Total Items {requestList.length}</h3>
      <div className={styles.wrapper } data-is-scrollable="true">
        <ScrollablePane scrollbarVisibility= { ScrollbarVisibility.auto} styles= { scrollablePaneStyles} >
          <DetailsList 
            styles={ headerStyle }
            items={ requestList }
            columns ={ columns }
            layoutMode={ DetailsListLayoutMode.justified }
            onRenderRow={ _onRenderRow }
            isHeaderVisible={true}
            onRenderDetailsHeader={ onRenderDetailsHeader}
            onItemInvoked={onItemInvoked}
          />
        </ScrollablePane>
      </div>
      </>
      }

      
      { isLoading === true ? 
        (<Spinner size={SpinnerSize.large} />) : selectedRowData && step === 2 &&
        <>
          {/* <ActionButton text="Back to list" iconProps={arrowIcon} style={{float:'right'}} onClick={()=> goToPreviousStep(step)}/> */}
          <ItemFormDetails  selectedRowData={selectedRowData} confirmationComments={confirmationComments} context= {props.context} decisionChoiceCallback={decisionChoiceCallback}/>
            {/* { selectedRowData.status === 'Submitted' ?
                <Stack horizontal horizontalAlign='center' tokens={sectionStackTokens} styles={stackStyles}>
                    <PrimaryButton id={'btn_1'} text={'Approve'} onClick={ handleApproveRejectButton } iconProps={ checked && selectedButton === 'Approve'  ? acceptIcon : null }/>
                    <PrimaryButton id={'btn_2'} text={'Reject'} onClick={ handleApproveRejectButton }  iconProps={ checked && selectedButton === 'Reject' ? acceptIcon : null }/>
                </Stack>
                : 
                null
            }  */}
            <Stack horizontal horizontalAlign="center" tokens={sectionStackTokens} styles={stackStyles}>
              
              <DefaultButton styles={buttonStyle} text={selectedRowData.status === 'Submitted' ? 'Previous': 'Back to Communities List Page'} onClick={() => goToPreviousStep(step)}/>
              
              {
                selectedRowData.status === "Submitted" &&
                  <PrimaryButton text={'Submit decision'} onClick={onConfirm}/>
              }
            </Stack>
            {showModal && <Complete data={ selectedRowData.id } status={ selectedRowData.decisionStatus }  showModal={showModal} onClose={closeModal}/>}
        </>
      }

      {/* { step === 3 &&   
            <Complete data={ selectedRowData.id } /> 
      } */}
     
      

      {/* { step === 3 &&
        <>        
        <Confirmation selectedRowData={ selectedRowData } confirmationComments={confirmationComments}/>
        <Stack horizontal horizontalAlign='center' tokens={sectionStackTokens}  styles={stackStyles}>
          <PrimaryButton text={'Back'} onClick={() => goToPreviousStep(step)}/>
          <PrimaryButton text={'Confirm'} onClick={onConfirm}/>
        </Stack>

        </>

      } */}
    
    
    </div>
      
      
    </>
    
  )


}

export default ScwAdmin


