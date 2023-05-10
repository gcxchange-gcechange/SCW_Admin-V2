/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { IScwAdminState } from './IScwAdminState';
import { IStackTokens, PrimaryButton, Stack } from 'office-ui-fabric-react';





const ItemFormDetails: React.FunctionComponent<IScwAdminState> = (props) => {

    const { selectedRowData } = props;


    const handleButtonClick = ():void => {
        console.log('clickMe');
    }

    const sectionStackTokens: IStackTokens = { childrenGap: 10 };



return (
    <>
        
        <h2>Request Detail</h2>
        <div style={{marginBottom: '10px'}}>
            <TextField label="Space Name (EN)" readOnly defaultValue={selectedRowData.spaceName} multiline autoAdjustHeight/>
            <TextField label="Space Name (FR)" readOnly defaultValue={selectedRowData.spaceName} multiline autoAdjustHeight/>         
            <TextField label="Space Description (EN)" readOnly defaultValue={selectedRowData.spaceDescription} multiline autoAdjustHeight/>
            <TextField label="Space Description (FR)" readOnly defaultValue={selectedRowData.spaceDescriptionFR} multiline autoAdjustHeight/>
            <TextField label="Team Purpose" readOnly defaultValue={ selectedRowData.businessJustification }  multiline autoAdjustHeight/>
            <TextField label="SharePoint Site url" readOnly defaultValue={ selectedRowData.siteUrl} />
            <TextField label="Requester Email" readOnly defaultValue={ selectedRowData.requesterEmail} />   
        </div>
        
            { selectedRowData.status === 'Submitted' ?
                <Stack horizontal horizontalAlign='center' tokens={sectionStackTokens}>
                    <PrimaryButton text={'Approve'} onClick={handleButtonClick}/>
                    <PrimaryButton text={'Reject'} />
                </Stack>
                : 
                null
            }
           
        
    </>
)

}

export default ItemFormDetails;