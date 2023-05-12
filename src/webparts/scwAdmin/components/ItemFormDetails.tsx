/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITextFieldStyles, TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { IScwAdminState } from './IScwAdminState';
import { IStackProps, IStackStyles,Stack } from 'office-ui-fabric-react';




const ItemFormDetails: React.FunctionComponent<IScwAdminState> = (props) => {

    const { selectedRowData } = props;

    // const stackTokens = { childrenGap: 18 }

    const stackTokens = { childrenGap: 50 };
    const stackStyles: Partial<IStackStyles> = { root: { width: 800} };
    const columnProps: Partial<IStackProps> = {
    tokens: { childrenGap: 10 },
    styles: { root: { width: '100%' } },
    };

    const textFieldWrapper: Partial<ITextFieldStyles> =  {
        wrapper: { borderBottom: 'none', }
    }

    // console.log("ItemPROPS", selectedRowData);
return (
    <>
        
        <h2>Community creation request detail</h2>
        <Stack horizontal tokens={stackTokens} styles={stackStyles}>
            <Stack {...columnProps}>
                <TextField label="Request Id:" styles= {textFieldWrapper} underlined readOnly defaultValue={selectedRowData.ID} />
                <TextField label="Status:" styles= {textFieldWrapper} underlined readOnly defaultValue={selectedRowData.status} />
                <TextField label="Requester Email:" styles= {textFieldWrapper} underlined readOnly defaultValue={selectedRowData.requesterEmail} />
                <TextField label="Community Sharepoint Url:" styles= {textFieldWrapper} underlined readOnly defaultValue={selectedRowData.siteUrl} />
            </Stack>
        </Stack>
        <hr/>
        <div>
            <TextField label="Community Purpose" readOnly defaultValue={ selectedRowData.businessJustification }  multiline autoAdjustHeight/>
            <TextField label="English Community Name" readOnly defaultValue={selectedRowData.spaceName} multiline autoAdjustHeight/>
            <TextField label="French Community Name" readOnly defaultValue={selectedRowData.spaceName} multiline autoAdjustHeight/>         
            <TextField label="English description" readOnly defaultValue={selectedRowData.spaceDescription} multiline autoAdjustHeight/>
            <TextField label="French description" readOnly defaultValue={selectedRowData.spaceDescriptionFR} multiline autoAdjustHeight/>
        </div>
        
    </>
)

}

export default ItemFormDetails;