import { TextField } from "office-ui-fabric-react";
import * as React from "react";
import { IScwAdminState } from "./IScwAdminState";


const Confirmation: React.FunctionComponent<IScwAdminState> = (props) => {

    console.log("3", props);

    // const commentInput = React.useRef<string>('');
    
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>):void  => {

    //    commentInput.current = event.target.value
        const inputData = event.target.value;
        
            console.log("inout", inputData);
            // console.log("commt", commentInput.current);
        
        props.handleOnChangeComments(inputData)
         
    }

    



    return (
        <>
        <h2>Confirm</h2>
        <TextField label="Comment (optional)" placeholder= "Type a comment to send to the requestor" multiline autoAdjustHeight onChange={handleOnChange} defaultValue={props.selectedRowData.comment}/>
        </>
    )
}

export default Confirmation;