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
import { DetailsList, 
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
  IconButton, 
  ScrollablePane, 
  ScrollbarVisibility,  
  Sticky,  
  StickyPositionType,  
  TooltipHost, 
  mergeStyleSets } from 'office-ui-fabric-react';
import { PagedItemCollection } from '@pnp/sp/items';
import ItemFormDetails from './ItemFormDetails';

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

  const LIST_NAME = 'Request';
  // let webUrl = 'https://devgcx.sharepoint.com/teams/App-SCW2';
  const _sp:SPFI = getSP(props.context);
  // const BATCH_SIZE = 10;

  const [requestList, setRequestList] = useState< ISCWList [] >( [] );
  const [ pageNumber, setPageNumber ] = useState< number >(0);
  const [selectedRowData, setSelectedRowData] = useState<any>();
  

  const columns: IColumn[] = [
    { key: 'Col0', name: 'ID', fieldName: 'id', minWidth: 100},
    { key: 'Col1', name: 'Space Name', fieldName: 'spaceName', minWidth: 100, maxWidth: 400, isResizable: true },
    { key: 'Col2', name: 'Reason', fieldName: 'businessJustification', minWidth: 100, maxWidth: 400, isResizable: true },
    { key: 'Col3', name: 'Template', fieldName: 'template', minWidth: 100 },
    { key: 'Col4', name: 'Status', fieldName: 'status', minWidth: 100 },
    { key: 'Col5', name: 'Created Date', fieldName: 'created', minWidth: 100 },
  ];
  


  
  const getList = async () => {

    let pagedItems: any[] = [];
    let pageNumber: number = 0;
    let items: PagedItemCollection<any[]> = undefined;

    do {
      if(!items) items = await _sp.web.lists.getByTitle(LIST_NAME).items.top(10).getPaged();
      else items = await items.getNext();

      if ( items.results.length > 0 ) {
        // console.log("we got results");
        pageNumber ++;
        // console.log("PN", pageNumber)
        pagedItems = pagedItems.concat(items.results);
      }
    } while (items.hasNext);  

    setPageNumber(pageNumber);
    
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
        siteUrl: item.SiteUrl
      }

    }))
     
  };
    
  

  useEffect(() => {

    getList();

  }, [pageNumber])

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
        customStyles.root = { backgroundColor: 'pink' };
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

  const arrowIcon:IIconProps = {iconName: 'NavigateBack'}



  return (
    <>
    <div className={styles.container}>
      { !selectedRowData &&
      <>
      <h1>Total Items {requestList.length}</h1>
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

      
      { selectedRowData &&
        <>
          <IconButton iconProps={arrowIcon} style={{float:'right'}}>Back to list</IconButton>
          <ItemFormDetails  selectedRowData={selectedRowData}/>
        </>
      }
      
    
    
    </div>
      
      
    </>
    
  )


}

export default ScwAdmin


