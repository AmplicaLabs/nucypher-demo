import React from "react";
import { Modal } from "react-bootstrap";

function ErrorsResult ({result, show, handleClose}: any){

    return(
        <Modal size="xl" show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Error results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <table className="table table-responsive">
            <thead>
                <tr>
                    <th>Ursala Address</th>
                    <th>Error Description</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(result).map(([address, res], index) =>{
                return(<tr key={index}>
                        <td>
                            {address}
                        </td>
                        <td className="text-danger">
                            {res}
                        </td>
                    </tr>)
                })}
            </tbody>
        </table>
    </Modal.Body>
    </Modal>)
}

export default ErrorsResult;