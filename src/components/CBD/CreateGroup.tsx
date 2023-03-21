import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { MEMBER_ADDRESS } from "./constant";

function CreateGroup({ account, show, handleClose, createNew }: any){
    const [groupName, setGroupName] = useState<string>("");
    const [checkedState, setCheckedState] = useState(
        new Array(MEMBER_ADDRESS.length - 1).fill(false)
    );

    function handleOnChange(position: number, m: any){
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
    }

    function handleNewGroup(){
        const members = checkedState.map((item, index)=>{
            if(item === true) {
                return MEMBER_ADDRESS[index + 1];
            }
        });

        createNew(groupName, members);
    }

    return(<Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="form">
            <div className="form-group row">
                <label htmlFor="name" className="col-sm-2 col-form-label" >Name:</label>
                <div className="col-sm-10">
                    <input type="textbox" maxLength={50} required className="form-control" id="name" name="name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                </div>
            </div>
            <div className="form-group mx-sm-4 mb-6">
            {
                MEMBER_ADDRESS.slice(1, MEMBER_ADDRESS.length).map((m: any, index: number) =>{
                    return(<span key={index}>
                        <input 
                        type="checkbox" 
                        id={`member-checkbox-${index}`} 
                        name="members" value="false" 
                        onChange={() => handleOnChange(index, m)}  
                        checked={checkedState[index]}/>
                        <label htmlFor={`member-checkbox-${index}`}>&#160;&#160;{m}&#160;&#160;</label><br/>
                    </span>)
                })
            }
            </div>
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleNewGroup()}>
            Create New
          </Button>
        </Modal.Footer>
      </Modal>)
}

export default CreateGroup;