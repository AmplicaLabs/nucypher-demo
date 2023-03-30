import React from "react";
import { Button, Modal } from "react-bootstrap";
var CopyToClipboard = require("react-copy-to-clipboard");

function ClipBoardCopy({ msg, show, handleClose }: any): JSX.Element {
    return (<Modal size="lg" show={show} onHide={handleClose} animation={false}>
    <Modal.Header closeButton>
      <Modal.Title>Node results</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {msg}<br/>
        <CopyToClipboard text={msg}>
            <Button variant="success">Copy to clipboard</Button>
        </CopyToClipboard>
    </Modal.Body>
    </Modal>)
}

export default ClipBoardCopy;