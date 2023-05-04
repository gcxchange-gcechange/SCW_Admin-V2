import * as React from 'react';
// import styles from './ScwAdmin.module.scss';
import { IScwAdminProps } from './IScwAdminProps';
// import { IScwAdminState } from './IScwAdminState';
import { getSP } from '../../../pnpjsConfig';
import { SPFI } from '@pnp/sp';
import { useEffect, useState  } from 'react';

export interface ISCWList {
  ID: number;

}




const ScwAdmin = (props: IScwAdminProps) => {

  const LIST_NAME = 'Request';
  const _sp:SPFI = getSP(props.context);

  const [requestItems, setRequestItems] = useState<ISCWList []>([])
  
  const getRequestItems = async () => {

    console.log('context', props.context);

    const items = _sp.web.lists.getByTitle(LIST_NAME).items();

    console.log("Items", items);

    setRequestItems((await items).map((item) => {

      return {
        ID: item.id,
        Title: item.Title
      }

    }))
  }


  useEffect(() => {

    getRequestItems();
    
  }, [])

  return (
    <div>{JSON.stringify(requestItems, null, 2)}</div>
  )
}

export default ScwAdmin


