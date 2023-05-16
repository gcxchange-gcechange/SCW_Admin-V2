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

    

    const stackStyles: Partial<IStackStyles> = { root: { width: 800} };

    const columnProps: Partial<IStackProps> = {
    // tokens: { childrenGap: 10 },
    styles: { root: {width: '80%', paddingLeft: '0px'}},
    };


    const textFieldBackground: Partial<ITextFieldStyles> = {
        field: { backgroundColor: 'rgb(218, 218, 218, 0.29)'}
        // subComponentStyles: { label: {color:  '#e8e8e8'}}
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

    const decisionOptions: IChoiceGroupOption[] = [
        { key: 'A', text: 'Approve community creation' },
        { key: 'B', text: 'Reject community creation' },
      ];

    // const labelFontStyle: Partial<ILabelStyles> = {
    //     root:{ fontSize: '18px'},
        
    // }

    // console.log("ItemPROPS", selectedRowData);


    return (
        <>
            
            <h2>Community creation request details</h2>
            <div>
                <Stack horizontal styles={stackStyles}>
                    <Stack  {...columnProps}>
                        <TextField label="Request Id:" styles= {customFieldStyles} underlined readOnly defaultValue={selectedRowData.id} />
                        <TextField label="Status:" styles= {customFieldStyles} underlined readOnly prefix={renderIcon()} defaultValue={selectedRowData.status}/>
                        <TextField label="Requester Email:" styles= {customFieldStyles} underlined readOnly defaultValue={selectedRowData.requesterEmail} />
                        <TextField label="Community Sharepoint Url:" styles= {customFieldStyles} underlined readOnly defaultValue={selectedRowData.siteUrl} />
                        
                    </Stack>
                </Stack>
            </div>
             
            <div className={styles.formContainer}>
                <TextField styles={textFieldBackground} label="Community Purpose" readOnly disabled defaultValue={ selectedRowData.businessJustification } multiline rows={3}/>
                <TextField styles={textFieldBackground} label="English Community Name" readOnly defaultValue={selectedRowData.spaceName} multiline rows={2} />
                <TextField styles={textFieldBackground} label="French Community Name" readOnly defaultValue={selectedRowData.spaceName} multiline rows={2}  />         
                <TextField styles={textFieldBackground} label="English description" readOnly defaultValue={selectedRowData.spaceDescription} />
                <TextField styles={textFieldBackground} label="French description" readOnly defaultValue={selectedRowData.spaceDescriptionFR} />
                <PeoplePicker
                    context={props.context}
                    titleText="Owners"
                    personSelectionLimit={3}
                    groupName={""} // Leave this blank in case you want to filter from all users
                    disabled={true}
                    defaultSelectedUsers={selectedRowData.members.split(',')}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                />
            </div>

            <div style={{paddingBottom: '18px'}}>
                <Stack horizontal verticalAlign='center'>
                    <span className={styles.asteriks}>&#42;</span>
                    <h3>Community creation decision</h3>
                </Stack>
                        <ChoiceGroup id='choiceDecision' options={decisionOptions} />
                                 
            </div>

            <div>
                <TextField label="Comment (optional)" placeholder= "Type a comment to send to the requestor" multiline autoAdjustHeight onChange={handleOnChange} defaultValue={props.selectedRowData.comment}/>
            </div>
            
             
            {/* { selectedRowData.status === 'Submitted' ?
                <hr/>
                :
                null
            } */}
            
        </>
    )

}

export default ItemFormDetails;