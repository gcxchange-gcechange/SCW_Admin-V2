/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextField } from "office-ui-fabric-react";
import * as React from "react";
// import { IScwAdminState } from "./IScwAdminState";

interface IConfirmationProps {
    selectedRowData: any;
    confirmationComments?:(value: string) => void;

}

const Confirmation: React.FunctionComponent<IConfirmationProps> = (props) => {

    console.log("3", props);

    // const commentInput = React.useRef<string>('');
    
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>):void  => {

    //    commentInput.current = event.target.value
        const inputData = event.target.value;
        
            console.log("input", inputData);
            // console.log("commt", commentInput.current);
        
        props.confirmationComments(inputData)
         
    }

    



    return (
        <>
        <h2>Confirmation</h2>
        <h3>Status: {props.selectedRowData.status}</h3>
        <TextField label="Comment (optional)" placeholder= "Type a comment to send to the requestor" multiline autoAdjustHeight onChange={handleOnChange} defaultValue={props.selectedRowData.comment}/>
        </>
    )
}

export default Confirmation;