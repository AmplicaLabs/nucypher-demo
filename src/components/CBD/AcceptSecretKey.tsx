import React from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function AcceptSecretKey({handleDecryptMessage, show, handleClose}: any){
    const [secretKey, setSecretKey] = useState<string>("");
    return(<Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body><div className="form">
        <div className="form-group row">
            <label htmlFor="name" className="col-sm-3 col-form-label">Message:</label>
            <div className="col-sm-9">
                <textarea rows={10} cols={100} required className="form-control" id="name" name="name" value={secretKey} 
                onChange={(e) => setSecretKey(e.target.value)} />
            </div>
        </div>
    </div>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Close
        </Button>
        <Button variant="primary" onClick={() => handleDecryptMessage(secretKey)}>
            Decrypt Message
        </Button>
    </Modal.Footer>
    </Modal>)
}

export default AcceptSecretKey;