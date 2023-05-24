/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITextFieldStyles, TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { ChoiceGroup, IChoiceGroupOption,  IStackProps, IStackStyles, Icon, Stack, mergeStyleSets } from 'office-ui-fabric-react';
import styles from './ScwAdmin.module.scss';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from '@microsoft/sp-webpart-base';


interface IItemFormDetailsProps {
    selectedRowData: any;
    context?: WebPartContext;
    requestList: any[];
    confirmationComments?:(value: string) => void;
    decisionChoiceCallback?:(option: string) => void;
}


const ItemFormDetails: React.FunctionComponent<IItemFormDetailsProps> = (props) => {

    console.log(props)
    
    const { selectedRowData, requestList } = props;
    
    

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
        wrapper: { borderBottom: 'none', outlineColor: 'transparent' },
        field: { borderBottom: 'none', color: 'fuscia'},
        fieldGroup:{ borderColor: 'transparent', boxShadow: 'none', outlineColor:'transparent'},
        subComponentStyles: { label: {root: { width: '190px', color: 'black'}}},
        prefix: {font: '18px', paddingRight: '0px', paddingTop: '6px', background: 'rgb(243, 242, 241)'}

      });

    const selectedItem: any[] = [];

        requestList.map((item) => {
            
            if (item.id === selectedRowData.id ) {
                selectedItem.push(item);
            }
        });
    

    const renderIcon = (): any => {
        

        switch(selectedItem[0].status ) {
            case "Submitted":
                return <Icon style={{color: '#F7B80A'}} iconName='AlertSolid'/>;
             
            case 'Approved':
                return <Icon style={{color: 'green'}} iconName='SkypeCircleCheck'/>;
           
            case  'Rejected':
                return <Icon style={{color: 'red'}} iconName='StatusErrorFull'/>;
            
            case 'Failed':
                return <Icon style={{color: 'red'}}  iconName='SkypeCircleMinus'/>;
            default:

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
                        <TextField label="Request id:" styles= {customFieldStyles} underlined disabled defaultValue={selectedRowData.id} />
                        <TextField label="Status:" styles= {customFieldStyles} underlined disabled prefix={renderIcon()} defaultValue={selectedItem[0].status}/>
                        <TextField label="Requester email:" styles= {customFieldStyles} underlined disabled defaultValue={selectedRowData.requesterEmail} />
                        <TextField label="Community sharepoint url:" styles= {customFieldStyles} underlined disabled defaultValue={selectedRowData.siteUrl} />
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
            {   selectedItem[0].status === 'Submitted' &&
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