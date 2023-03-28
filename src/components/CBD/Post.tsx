import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function Post({ account, group, show, handleClose, createNewPost }: any){
    const [msg, setMsg] = useState<string>("");
    const [isKeyRotate, setIsKeyRotate] = useState<boolean>(false);

    function handleKeyRotation(e: any) {
      setIsKeyRotate(e.target.checked);
    }

    return(<Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="form">
            <div className="form-group row">
                <label htmlFor="groupName" className="col-sm-3 col-form-label">Group Name:</label>
                <div className="col-sm-9">
                <label className="col-form-label" >{group.name}</label>
                </div>
            </div>
            <div className="form-group row">
                <label htmlFor="name" className="col-sm-3 col-form-label">Message:</label>
                <div className="col-sm-9">
                    <textarea maxLength={50} required className="form-control" id="name" name="name" value={msg} 
                    onChange={(e) => setMsg(e.target.value)} />
                </div>
            </div>
            <div className="form-group row">
                <label htmlFor="name" className="col-sm-3 col-form-label">Message:</label>
                <div className="col-sm-9">
                <input 
                    type="checkbox" 
                    id="keyrotation"
                    name="keyrotation"
                    value="false" 
                    onChange={(e) => handleKeyRotation(e)}  
                    checked={isKeyRotate}/>
                    <label htmlFor="keyrotation">Rotate Key</label>
                </div>
            </div>
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => createNewPost(group, msg, isKeyRotate)}>
            Post
          </Button>
        </Modal.Footer>
      </Modal>)
}

export default Post;