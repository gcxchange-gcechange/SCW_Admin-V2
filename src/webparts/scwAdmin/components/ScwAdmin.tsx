/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import styles from './ScwAdmin.module.scss';
import { IScwAdminProps } from './IScwAdminProps';
// import { IScwAdminState } from './IScwAdminState';
import { getSP } from '../../../pnpjsConfig';
import { SPFI } from '@pnp/sp';
import '@pnp/sp/items';
import "@pnp/sp/items/get-all";
import { useEffect, useState  } from 'react';
import { ActionButton,  DetailsList, 
  DetailsListLayoutMode, 
  DetailsRow, 
  IColumn, 
  IDetailsColumnRenderTooltipProps, 
  IDetailsColumnStyles, 
  IDetailsHeaderProps, 
  IDetailsListProps, 
  IDetailsRowStyles, 
  IIconProps, 
  IRenderFunction, 
  IScrollablePaneStyles, 
  IStackStyles, 
  IStackTokens, 
  // IconButton, 
  PrimaryButton, 
  ScrollablePane, 
  ScrollbarVisibility,  
  Stack,  
  Sticky,  
  StickyPositionType,  
  TooltipHost, 
  mergeStyleSets } from 'office-ui-fabric-react';
import { PagedItemCollection } from '@pnp/sp/items';
import ItemFormDetails from './ItemFormDetails';
// import Confirmation from './Confirmation';
import { getTheme } from '@fluentui/react/lib/Styling';

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
  // let webUrl = 'https://devgcx.sharepoint.com/teams/App-SCW2';
  const _sp:SPFI = getSP(props.context);
  // const BATCH_SIZE = 10;

  const [requestList, setRequestList] = useState< ISCWList [] >( [] );
  // const [ pageNumber, setPageNumber ] = useState< number >(0);
  const [selectedRowData, setSelectedRowData] = useState<any>();
  const [step, setCurrentStep] = useState<number>(1);
  const [checked, setChecked ] = useState<boolean>(false);
  const [selectedButton, setSelectedButton ] = useState<string>(null);
  

  const columns: IColumn[] = [
    { key: 'Col0', name: 'ID', fieldName: 'id', minWidth: 20},
    { key: 'Col1', name: 'Space Name', fieldName: 'spaceName', minWidth: 100, maxWidth: 400, isResizable: true },
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
    console.log("previous", previousPage);
    setSelectedRowData({
      ...selectedRowData,
      status: 'Submitted'
    })
    setCurrentStep(previousPage);
  }
  
  const getList = async () => {
    console.log("step", step)
    let pagedItems: any[] = [];
    // let pageNumber: number = 0;
    let items: PagedItemCollection<any[]> = undefined;

    do {
      if(!items) items = await _sp.web.lists.getByTitle(LIST_NAME).items.top(10).orderBy("Created", false).getPaged();
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

  }, [])

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

  const arrowIcon:IIconProps = {iconName: 'NavigateBack'};
  const acceptIcon: IIconProps = { iconName: 'Accept'};


  // useEffect(() => {
   
  // }, [])
  

  const handleApproveRejectButton = (event: any ):void => {
    const selectedBtnName: string = event.target.textContent;
    console.log("ev", selectedBtnName);
 
    setSelectedButton(selectedBtnName);
    
    if( selectedBtnName === 'Approve') {
      setSelectedRowData({
        ...selectedRowData,
        status: 'Approved'
      })

      setChecked((prev) => !prev)
    }
    else if ( selectedBtnName === 'Reject' ) {
      setSelectedRowData({
        ...selectedRowData,
        status: 'Rejected'
        
      })

      setChecked((prev) => !prev)
    }
     

      console.log("4",selectedRowData);
  

     goToNextStep(step)
     
   }




  const confirmationComments = (value: string):void => {
      console.log("value", value);

    setSelectedRowData({
      ...selectedRowData,
      comment: value
    })
    
    console.log("state", selectedRowData)
  }

  
  const onConfirm = ():void  => {
    console.log("hello")
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

      
      { selectedRowData && step === 2 &&
        <>
          <ActionButton text="Back to list" iconProps={arrowIcon} style={{float:'right'}} onClick={()=> goToPreviousStep(step)}/>
          <ItemFormDetails  selectedRowData={selectedRowData} confirmationComments={confirmationComments} context= {props.context}/>
            { selectedRowData.status === 'Submitted' ?
                <Stack horizontal horizontalAlign='center' tokens={sectionStackTokens} styles={stackStyles}>
                    <PrimaryButton id={'btn_1'} text={'Approve'} onClick={ handleApproveRejectButton } iconProps={ checked && selectedButton === 'Approve'  ? acceptIcon : null }/>
                    <PrimaryButton id={'btn_2'} text={'Reject'} onClick={ handleApproveRejectButton }  iconProps={ checked && selectedButton === 'Reject' ? acceptIcon : null }/>
                </Stack>
                : 
                null
            } 
            <PrimaryButton text={'Back'} onClick={() => goToPreviousStep(step)}/>
            <PrimaryButton text={'Confirm'} onClick={onConfirm}/>
        </>
      }
      

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


