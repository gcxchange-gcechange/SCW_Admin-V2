/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITextFieldStyles, TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { IScwAdminState } from './IScwAdminState';
import { IStackProps, IStackStyles, Icon, Stack, mergeStyleSets } from 'office-ui-fabric-react';
import styles from './ScwAdmin.module.scss';
 




const ItemFormDetails: React.FunctionComponent<IScwAdminState> = (props) => {

    const { selectedRowData } = props;


    // const stackTokens = { childrenGap: 10 };
    const stackStyles: Partial<IStackStyles> = { root: { width: 800} };
    const columnProps: Partial<IStackProps> = {
    // tokens: { childrenGap: 10 },
    styles: { root: {width: '80%', paddingLeft: '0px'}},
    };
    // const verticalGapStackTokens: IStackTokens = {
    //     childrenGap: 10,
    //     padding: 10,
    //   };


    const textFieldBackground: Partial<ITextFieldStyles> = {
        field: { backgroundColor:  '#e8e8e8'}
    }

 
    const customFieldStyles = mergeStyleSets ({
        wrapper: { borderBottom: 'none', outline: 'transparent'},
        field: { borderBottom: 'none'},
        fieldGroup:{ borderBottom: 'transparent', boxShadow: 'none', outline:'transparent'},
        subComponentStyles: { label: {root: { width: '190px'}}},
        prefix: {font: '18px', paddingRight: '0px', paddingTop: '6px'}

      });

   

    const renderIcon = (): any => {

        if (selectedRowData.status === 'Submitted') {
            return <Icon style={{color: '#F7B80A'}} iconName='AlertSolid'/>
        }
        else if (selectedRowData.status === 'Failed') {
            return <Icon style={{color: 'red'}}  iconName='SkypeCircleMinus'/>
        }
        else if (selectedRowData.status === 'Approved') {
            return <Icon style={{color: 'green'}} iconName='SkypeCircleCheck'/>
        }
        else if (selectedRowData.status === 'Rejected') {
            return <Icon style={{color: 'red'}} iconName='StatusErrorFull'/>
        }
        
        
    }


    // console.log("ItemPROPS", selectedRowData);
    return (
        <>
            
            <h2>Community creation request details</h2>

            <Stack horizontal styles={stackStyles}>
                <Stack  {...columnProps}>
                    <TextField label="Request Id:" styles= {customFieldStyles} underlined readOnly defaultValue={selectedRowData.id} />
                    <TextField label="Status:" styles= {customFieldStyles} underlined readOnly prefix={renderIcon()} defaultValue={selectedRowData.status}/>
                    <TextField label="Requester Email:" styles= {customFieldStyles} underlined readOnly defaultValue={selectedRowData.requesterEmail} />
                    <TextField label="Community Sharepoint Url:" styles= {customFieldStyles} underlined readOnly defaultValue={selectedRowData.siteUrl} />
                </Stack>
            </Stack>
            <hr/>
            <div className={styles.formContainer}>
                <TextField styles={textFieldBackground} label="Community Purpose" readOnly defaultValue={ selectedRowData.businessJustification }  multiline rows={3}/>
                <TextField styles={textFieldBackground} label="English Community Name" readOnly defaultValue={selectedRowData.spaceName} multiline rows={2} />
                <TextField styles={textFieldBackground} label="French Community Name" readOnly defaultValue={selectedRowData.spaceName} multiline rows={2}  />         
                <TextField styles={textFieldBackground} label="English description" readOnly defaultValue={selectedRowData.spaceDescription} />
                <TextField styles={textFieldBackground} label="French description" readOnly defaultValue={selectedRowData.spaceDescriptionFR} />
            </div>
            { selectedRowData.status === 'Submitted' ?
                <hr/>
                :
                null
            }
            
        </>
    )

}

export default ItemFormDetails;