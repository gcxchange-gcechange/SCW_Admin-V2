import * as React from "react";
import styles from "./ScwAdmin.module.scss";
import { IStackTokens, Icon, IconButton, Modal, PrimaryButton, Stack, StackItem } from "office-ui-fabric-react";


interface ICompleteProps {
    data: string;
    // close: boolean;
    status: string;
    showModal: boolean;
    // openModal?: () => void;
    onClose?:() => void;
}

const Complete: React.FunctionComponent<ICompleteProps> = ({ data, status, showModal, onClose }) => {

   


    const modalStyle = {
        main: {
          display: "flex",
          borderRadius: "5px",
          minWidth: "600px",
          maxWidth: "600px",
        },
        header: {
          backgroundColor: "#106EBE",
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

 
    console.log('props3',PermissionStatus);

    const spacingTokens: IStackTokens = {
        childrenGap: '15px',
        padding: '15px',
      };




    
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
                    <h2>Community creation ID#{ data }</h2>
                    <IconButton
                        className={ styles.cancelIcon }
                        iconProps={{iconName: "Cancel" }}
                        onClick={onClose}
                    />
                </div>
                    <div style={modalStyle.footer}>
                        <Stack>
                            <Stack horizontal horizontalAlign="center" tokens={spacingTokens}>
                                <Stack.Item  align="center">
                                    { status === "Approved" ?
                                        <Icon style={{color: '#1da51d', fontSize: '20px'}} iconName="SkypeCircleCheck"/> 
                                        :
                                        <Icon style={{color: 'red', fontSize: '20px'}} iconName="StatusErrorFull"/>
                                    }
                                </Stack.Item>
                                <StackItem>
                                    <span>Community ID#{data} {status === "Approved" ? `created` : `rejected`}</span>
                                </StackItem>
                            </Stack>

                            <Stack.Item>
                                <hr className={styles.horizontalLine} />
                            </Stack.Item>
                            <Stack.Item align="center">
                                <PrimaryButton
                                    onClick={onClose}
                                    className={styles.close}
                                >
                                    CLOSE
                                </PrimaryButton>
                            </Stack.Item>
                        </Stack>
                        
                    </div>
            </Modal>
        </>
    )
}

export default Complete;
