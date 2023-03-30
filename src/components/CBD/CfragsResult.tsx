import React from "react";
import { Modal } from "react-bootstrap";

function CFragsResult ({result, show, handleClose}: any){

    function cipherText (encMsg: any){
        const encodedEncryptedMessage = Buffer.from(
            encMsg.toBytes()
        ).toString("base64");
        return encodedEncryptedMessage;
    }

    return(
        <Modal size="xl" show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Node results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <table className="table table-responsive">
            <thead>
                <tr>
                    <th>Ursala Address</th>
                    <th>Cipher text</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(result).map(([address, res], index) =>{
                return(<tr key={index}>
                        <td>
                            {address}
                        </td>
                        <td className="text-wrap">
                            {cipherText(res)}
                        </td>
                    </tr>)
                })}
            </tbody>
        </table>
    </Modal.Body>
    </Modal>)
}

export default CFragsResult;