import * as React from "react";
import styles from "./ScwAdmin.module.scss";
import { IStackTokens, Icon, IconButton, Modal, PrimaryButton, Stack, StackItem } from "office-ui-fabric-react";


interface ICompleteProps {
    isError: number;
    data: string;
    status: string;
    showModal: boolean;
    spaceName: string;
    spaceNameFr: string;
    onClose?:() => void;
}

const Complete: React.FunctionComponent<ICompleteProps> = ({ data, status, showModal, onClose, isError, spaceName, spaceNameFr }) => {

   


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
        errorHeader: {
            backgroundColor: "#E6676B",
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
        icon: {
            fontSize: '25px',
            color: '#F7B80A',
            paddingRight: '10px'
        }

      };

 


    const spacingTokens: IStackTokens = {
        childrenGap: '15px',
        padding: '15px',
      };

    // console.log("status", status);
    // console.log("data", data)
    // console.log("Errors", isError);


    return (
        <>

        { isError === 200 || isError === 0 ?
            <Modal
                isOpen={ showModal }
                onDismiss={ onClose }
                isBlocking={ true }
                styles={{
                main: modalStyle.main,
                }}
            >
                <div style={ modalStyle.header }>
                   {status === undefined ?
                    <h2>Did you forget something?</h2>
                    :
                    <h2>Community creation ID#{ data }</h2>
                   }
                    
                    <IconButton
                        className={ styles.cancelIcon }
                        iconProps={{iconName: "Cancel" }}
                        onClick={onClose}
                    />
                </div>
                    <div style={modalStyle.footer}>
                       
                        <Stack>
                            <Stack horizontal horizontalAlign="start" tokens={spacingTokens}>
                                <Stack.Item  align="center">
                                    {status === "Approved" ? (
                                        <Icon style={{color: '#1da51d', fontSize: '20px'}} iconName="SkypeCircleCheck"/>
                                        ) : status === "Rejected" ? (
                                        <Icon style={{color: '#ff2200', fontSize: '20px'}} iconName="StatusErrorFull"/>
                                        ) : null
                                    } 
                                </Stack.Item>
                                <StackItem>
                                    { status === undefined ?
                                    <span>You must select a <strong>Communty creation decision</strong> before proceeding</span>
                                    :
                                    <span>The following community (ID#{data}) is <strong>{status === "Approved" ? `created.` : `rejected.`}</strong></span>
                                    } 
                                </StackItem>
                                
                            </Stack>
                            { status !== undefined ?
                            <Stack  tokens={spacingTokens} style={{marginLeft: '38px'}}>
                                <Stack.Item align="start"><p>{spaceName}</p></Stack.Item>
                                <Stack.Item align="start"><p>{spaceNameFr}</p></Stack.Item>
                            </Stack>
                            : 
                            ''
                            }
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
            :
                <Modal
                isOpen={ showModal }
                onDismiss={ onClose }
                isBlocking={ true }
                styles={{
                main: modalStyle.main,
                }}
            >
                <div style={ modalStyle.errorHeader }>
                    
                    <h2>Error</h2>
                    <IconButton
                        className={ styles.cancelIcon }
                        iconProps={{iconName: "Cancel" }}
                        onClick={onClose}
                    />
                </div>
                    <div style={modalStyle.footer}>
                       <Stack horizontal horizontalAlign="center">
                            <Stack.Item align='center'>
                                <Icon style={ modalStyle.icon } iconName='IncidentTriangle'/>
                            </Stack.Item>
                            <StackItem>
                                <p style={{fontSize: '20px'}}><strong>Something went wrong!</strong></p> 
                            </StackItem>
                       </Stack>   
                        
                    </div>
            </Modal>
            } 
        </>
    )
}

export default Complete;
