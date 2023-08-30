/* eslint-disable @typescript-eslint/no-unused-vars */
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

    
    const { selectedRowData, requestList } = props;  
    console.log("O", selectedRowData.owners);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>):void  => {

            const inputData = event.target.value;
            
            props.confirmationComments(inputData)
             
    }

    const onSelectedKey = ( event: React.ChangeEvent<HTMLInputElement>, option: IChoiceGroupOption):void => {

        props.decisionChoiceCallback(option.key)
        
    }
    

    const stackStyles: Partial<IStackStyles> = { root: { width: '100%'} };

    const columnProps: Partial<IStackProps> = {
    styles: { root: {width: '100%', paddingLeft: '0px', display: 'flex'}},
    };


    const textFieldBackground: Partial<ITextFieldStyles> = {
        field: {backgroundColor: 'rgb(218, 218, 218, 0.29)'},
        fieldGroup: {borderColor: 'rgb(218, 218, 218, 0.29)'}
    }

 
    const customFieldStyles = mergeStyleSets ({
        wrapper: { borderBottom: 'none', outlineColor: 'transparent', marginBottom: '10px' },
        field: { borderBottom: 'none', color:'black', maxWidth:'1107px'},
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
    
    let comment = '';

    const decisionComments = (): string => {
        if (selectedItem[0].comment) { 
            comment = selectedItem[0].comment.split(/<div\b[^>]*>(.*?)<\/div>/gi)[1];
        } else {
            comment ='N/A'
        }

        if(comment === "undefined") {
            comment = 'N/A'
        }

        return comment; 
    }
    
   
   


    const renderIcon = (): any => {
        

        switch(selectedItem[0].status ) {
            case "Submitted":
                return <span className={styles.iconStyle}><Icon iconName='SkypeCircleClock'/></span>;
             
            case 'Approved':
                return <span className={styles.iconStyle}><Icon className={styles.approved} iconName='SkypeCircleCheck'/></span>;
           
            case  'Rejected':
                return <span className={styles.iconStyle}><Icon className={styles.rejected} iconName='StatusErrorFull'/> </span>;
            
            case 'Failed':
                return <span className={styles.iconStyle}><Icon className={styles.failed}  iconName='IncidentTriangle'/> </span>;
            case 'Complete':
                return <span className={styles.iconStyle}><Icon className={styles.completed}  iconName='VerifiedBrandSolid'/> </span>;
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
                <Stack horizontal styles={stackStyles} >
                    <Stack wrap {...columnProps}>
                        <TextField label="Request id:" styles= {customFieldStyles} underlined disabled defaultValue={selectedRowData.id} />
                        <TextField label="Status:" styles= {customFieldStyles} underlined disabled prefix={renderIcon()} defaultValue={selectedItem[0].status}/>
                        { selectedItem[0].status !== 'Submitted' && 
                            <TextField styles= {customFieldStyles} label="Decision comments" underlined multiline rows={5} disabled defaultValue={decisionComments()}/>
                        }
                        <TextField label="Requester email:" styles= {customFieldStyles} underlined disabled defaultValue={selectedRowData.requesterEmail} />
                        <TextField label="Community sharepoint url:" styles= {customFieldStyles} underlined disabled defaultValue={selectedRowData.siteUrl ? selectedRowData.siteUrl : "Not yet created"} />
                    </Stack>
                </Stack>
            </div>
             
            <div className={styles.formContainer}>
                <TextField styles={textFieldBackground} label="Community purpose" readOnly defaultValue={ selectedRowData.businessJustification } multiline rows={5}/>
                <TextField styles={textFieldBackground} label="English community name" readOnly defaultValue={selectedRowData.spaceName} multiline rows={2}/>
                <TextField styles={textFieldBackground} label="French community name" readOnly defaultValue={selectedRowData.spaceNameFr} multiline rows={2}/>         
                <TextField styles={textFieldBackground} label="English description" readOnly defaultValue={selectedRowData.spaceDescription}  />
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
                        <ChoiceGroup required id='choiceDecision' options={decisionOptions} onChange={onSelectedKey}/>                
                    </div>
 
                    <div>
                        <TextField label="Decision comments (optional)" placeholder= "Type a comment to send to the requestor" multiline autoAdjustHeight onChange={handleOnChange} defaultValue={props.selectedRowData.decisionComments}/>
                    </div>
                </>      
            }
           
            
        </>
    )

}

export default ItemFormDetails;