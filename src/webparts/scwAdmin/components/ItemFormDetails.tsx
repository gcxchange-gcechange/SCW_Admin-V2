/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITextFieldStyles, TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { IScwAdminState } from './IScwAdminState';
import { ChoiceGroup, IChoiceGroupOption,  IStackProps, IStackStyles, Icon, Stack, mergeStyleSets } from 'office-ui-fabric-react';
import styles from './ScwAdmin.module.scss';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";


const ItemFormDetails: React.FunctionComponent<IScwAdminState> = (props) => {

    console.log(props)
    
    const { selectedRowData } = props;

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>):void  => {

        //    commentInput.current = event.target.value
            const inputData = event.target.value;
            
                console.log("input", inputData);
                // console.log("commt", commentInput.current);
            
            props.confirmationComments(inputData)
             
    }

    const onSelectedKey = ( event: React.ChangeEvent<HTMLInputElement>, option: IChoiceGroupOption):void => {

        props.decisionChoiceCallback(option.key)
        
    }
    

    const stackStyles: Partial<IStackStyles> = { root: { width: 800} };

    const columnProps: Partial<IStackProps> = {
    // tokens: { childrenGap: 10 },
    styles: { root: {width: '80%', paddingLeft: '0px'}},
    };


    const textFieldBackground: Partial<ITextFieldStyles> = {
        field: {backgroundColor: 'rgb(218, 218, 218, 0.29)'},
        fieldGroup: {borderColor: 'rgb(218, 218, 218, 0.29)'}
        // subComponentStyles: { label: {color:  '#e8e8e8'}}
    }

 
    const customFieldStyles = mergeStyleSets ({
        wrapper: { borderBottom: 'none', outline: 'transparent'},
        field: { borderBottom: 'none'},
        fieldGroup:{ borderColor: 'none', boxShadow: 'none', outlineColor:'transparent'},
        subComponentStyles: { label: {root: { width: '190px', borderBottom: 'none'}}},
        prefix: {font: '18px', paddingRight: '0px', paddingTop: '6px', background: 'none'}

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

    const decisionOptions: IChoiceGroupOption[] = [
        { key: 'A', text: 'Approve community creation' },
        { key: 'B', text: 'Reject community creation' },
      ];

   


    return (
        <>
            
            <h2>Community creation request details</h2>
            <div>
                <Stack horizontal styles={stackStyles}>
                    <Stack  {...columnProps}>
                        <TextField label="Request id:" styles= {customFieldStyles} underlined readOnly defaultValue={selectedRowData.id} />
                        <TextField label="Status:" styles= {customFieldStyles} underlined readOnly prefix={renderIcon()} defaultValue={selectedRowData.status}/>
                        <TextField label="Requester email:" styles= {customFieldStyles} underlined readOnly defaultValue={selectedRowData.requesterEmail} />
                        <TextField label="Community sharepoint url:" styles= {customFieldStyles} underlined readOnly defaultValue={selectedRowData.siteUrl} />
                    </Stack>
                </Stack>
            </div>
             
            <div className={styles.formContainer}>
                <TextField styles={textFieldBackground} label="Community purpose" readOnly defaultValue={ selectedRowData.businessJustification } rows={3}/>
                <TextField styles={textFieldBackground} label="English community name" readOnly defaultValue={selectedRowData.spaceName} rows={2} />
                <TextField styles={textFieldBackground} label="French community name" readOnly defaultValue={selectedRowData.spaceName}  rows={2}  />         
                <TextField styles={textFieldBackground} label="English description" readOnly defaultValue={selectedRowData.spaceDescription} />
                <TextField styles={textFieldBackground} label="French description" readOnly defaultValue={selectedRowData.spaceDescriptionFR} />
                <PeoplePicker
                    context={props.context}
                    titleText="Owners"
                    personSelectionLimit={3}
                    groupName={""} // Leave this blank in case you want to filter from all users
                    disabled={true}
                    defaultSelectedUsers={selectedRowData.owner1.split(',')} 
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                />

            </div>
            {   selectedRowData.status === 'Submitted' &&
                <>
                    <div style={{paddingBottom: '18px'}}>
                    <Stack horizontal verticalAlign='center'>
                        <span className={styles.asteriks}>&#42;</span>
                        <h3>Community creation decision</h3>
                    </Stack>
                    <ChoiceGroup id='choiceDecision' options={decisionOptions} onChange={onSelectedKey}/>
                                    
                    </div>
 
                    <div>
                        <TextField label="Decision comments (optional)" placeholder= "Type a comment to send to the requestor" multiline autoAdjustHeight onChange={handleOnChange} defaultValue={props.selectedRowData.comment}/>
                    </div>
                </>      
            }
           
            
        </>
    )

}

export default ItemFormDetails;