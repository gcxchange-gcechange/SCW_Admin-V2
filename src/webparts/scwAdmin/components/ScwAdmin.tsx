import * as React from 'react';
import styles from './ScwAdmin.module.scss';
import { IScwAdminProps } from './IScwAdminProps';
import { IScwAdminState } from './IScwAdminState';
import { getSP } from '../../../pnpjsConfig';
import { SPFI } from '@pnp/sp';






export default class ScwAdmin extends React.Component<IScwAdminProps, IScwAdminState> {
  public _sp:SPFI = getSP(this.props.context);


  constructor(props:IScwAdminProps) {
    super(props);

    this.state = {
     
    }
  }



  public render(): React.ReactElement<IScwAdminProps> {
   
    const items =  this._sp.web.lists.getByTitle("Request")

    console.log("items", items)

    return (
      <>
        <div className={styles.welcome}>Hello</div>
      </>
    );

   

  }
}
