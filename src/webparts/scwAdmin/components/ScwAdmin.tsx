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
import { DetailsList, DetailsListLayoutMode, DetailsRow, IColumn, IDetailsColumnStyles, IDetailsListProps, IDetailsRowStyles} from 'office-ui-fabric-react';
import { PagedItemCollection } from '@pnp/sp/items';

export interface ISCWList {
  id: number;
  spaceName: string;
  businessJustification: string;
  created: string;
  // template: string;
  status: string;
  // date: string;

}


const ScwAdmin = (props: IScwAdminProps) => {

  const LIST_NAME = 'Request';
  // let webUrl = 'https://devgcx.sharepoint.com/teams/App-SCW2';
  const _sp:SPFI = getSP(props.context);
  // const BATCH_SIZE = 10;

  const [requestItems, setRequestItems] = useState< ISCWList [] >( [] )

  const columns: IColumn[] = [
    { key: 'Col1', name: 'Space Name', fieldName: 'spaceName', minWidth: 100, maxWidth: 400, isResizable: true },
    { key: 'Col2', name: 'Reason', fieldName: 'businessJustification', minWidth: 100, maxWidth: 400, isResizable: true },
    { key: 'Col3', name: 'Template', fieldName: 'template', minWidth: 100 },
    { key: 'Col4', name: 'Status', fieldName: 'status', minWidth: 100 },
    { key: 'Col5', name: 'Created Date', fieldName: 'created', minWidth: 100 },
  ];
  


  
  const getRequestItems = async () => {

    let pagedItems: any[] = [];
    let items: PagedItemCollection<any[]> = undefined;

    do {
      if(!items) items = await _sp.web.lists.getByTitle(LIST_NAME).items.top(10).getPaged();
      else items = await items.getNext();

      if ( items.results.length > 0 ) {
        console.log("we got results");
        pagedItems = pagedItems.concat(items.results);
      }
    } while (items.hasNext);  
    
      setRequestItems((pagedItems).map((item) => {
    
        return {
          id: item.ID,
          spaceName: item.SpaceName,
          businessJustification: item.BusinessJustification,
          created: new Date(item.Created).toLocaleDateString("en-CA"),
          status: item.Status

        }

      }))
  };
    
  

  useEffect(() => {

    getRequestItems();

  }, [])

  const headerStyle: Partial<IDetailsColumnStyles> = {
    cellTitle: {
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

 console.log("state",requestItems);
  return (
    <>
    <div>HELLO</div>
    <div className={styles.container} data-is-scrollable>
      {/* <ScrollablePane scrollbarVisibility= { ScrollbarVisibility.auto}> */}
        <DetailsList 
          styles={ headerStyle }
          items={ requestItems }
          columns ={ columns }
          layoutMode={ DetailsListLayoutMode.justified }
          onRenderRow={ _onRenderRow }
        />
      {/* </ScrollablePane> */}
    </div>
      
      
    </>
    
  )


}

export default ScwAdmin


