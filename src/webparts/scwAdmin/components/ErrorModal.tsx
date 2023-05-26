import * as React from "react";
import styles from "./ScwAdmin.module.scss";
import { IconButton, Modal} from "office-ui-fabric-react";


interface IErrorModalProps { 
    showModal: boolean;
    isError: number;
    onClose?:() => void;
}

const ErrorModal: React.FunctionComponent<IErrorModalProps> = ({ showModal, onClose, isError }) => {

   


    const modalStyle = {
        main: {
          display: "flex",
          borderRadius: "5px",
          minWidth: "600px",
          maxWidth: "600px",
        },
        header: {
          backgroundColor: "red",
          color: "white",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "30px",
          paddingRight: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
        footer: {
          padding: "10px",
          marginLeft: "60px",
          marginRight: "60px"
        },
      };

 

    // const spacingTokens: IStackTokens = {
    //     childrenGap: '15px',
    //     padding: '15px',
    //   };



    console.log("ErrorModalModal", isError);
    
    return (
        <>
        
            <Modal
                isOpen={ showModal }
                onDismiss={ onClose }
                isBlocking={ true }
                styles={{
                main: modalStyle.main,
                }}
            >
                <div style={ modalStyle.header }>
                    
                    <h2>Uh. OH.</h2>
                 
                    <IconButton
                        className={ styles.cancelIcon }
                        iconProps={{iconName: "Cancel" }}
                        onClick={onClose}
                    />
                </div>
                    <div style={modalStyle.footer}>
                       
                        <div>OOPS something went wrong</div>
                        
                    </div>
            </Modal>
            

        
        </>
    )
}

export default ErrorModal;
