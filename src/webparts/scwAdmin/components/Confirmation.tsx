import { TextField } from "office-ui-fabric-react";
import * as React from "react";
import { IScwAdminState } from "./IScwAdminState";


const Confirmation: React.FunctionComponent<IScwAdminState> = (props) => {

    console.log("3", props);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>):void  => {
        const inputData = event.target.value;
        
            console.log("inout", inputData);
        
        props.handleOnChangeComments(inputData)
         
    }



    return (
        <>
        <h2>Confirm</h2>
        <TextField label="Comment (optional)" placeholder= "Type a comment to send to the requestor" multiline autoAdjustHeight onChange={handleOnChange} />
        </>
    )
}

export default Confirmation;