import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { IScwAdminState } from './IScwAdminState';
// import { IScwAdminProps } from './IScwAdminProps';



const ItemFormDetails: React.FunctionComponent<IScwAdminState> = ({requestList }) => {

    console.log("ReqItems", requestList)


return (
    <>
        {requestList.map((item) => {
            <TextField label="Space Name" readOnly defaultValue={item.spaceName} />
        })}
        <h3>Request Detail</h3>
        
        <TextField label="Space Description (EN)" readOnly defaultValue="I am read-only" />
        <TextField label="Space Description (FR)" readOnly defaultValue="I am read-only" />
        <TextField label="Team Purpose" readOnly defaultValue="I am read-only" />
        <TextField label="SharePoint Site url" readOnly defaultValue="I am read-only" />
        <TextField label="Requester Email" readOnly defaultValue="I am read-only" />
    </>
)

}

export default ItemFormDetails;