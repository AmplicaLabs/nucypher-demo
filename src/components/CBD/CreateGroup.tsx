import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { NUMBER_OF_ACCOUNTS, USER_ADDRESS } from "./constant";

function CreateGroup({ account, show, handleClose, createNew }: any){
    const [groupName, setGroupName] = useState<string>("");
    const [threshold, setThreshold] = useState<number>(3);
    const [shares, setShares] = useState<number>(5);
    const [checkedState, setCheckedState] = useState(
        new Array(NUMBER_OF_ACCOUNTS - 1).fill(false)
    );
    const [selectedMembers, setSelectedMembers] = useState<any>([]);
    
    function handleOnChange(position: number, address: string, name: string, e: any){
        const updatedCheckedState = checkedState.map((checked, index) =>
            index === position ? !checked : checked
        );
        setCheckedState(updatedCheckedState);
        const checked = e.target.checked;
        if (checked === true) {
            const mem: any = {name, address, checked: e.target.checked};
            setSelectedMembers([...selectedMembers, mem])
        }
    }

    function handleNewGroup(){
        const members = selectedMembers.map((item: any, index: number)=>{
            if(item.checked === true) {
                return item;
            }
        });

        createNew(groupName, members, threshold, shares);
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
            <div className="form-group row">
                <label htmlFor="threshold" className="col-sm-2 col-form-label" >Threshold:</label>
                <div className="col-sm-10">
                    <input type="number" maxLength={50} required className="form-control" id="threshold" name="threshold" value={threshold} onChange={(e) => setThreshold(+e.target.value)} />
                </div>
            </div>
            <div className="form-group row">
                <label htmlFor="shares" className="col-sm-2 col-form-label" >Shares:</label>
                <div className="col-sm-10">
                    <input type="number" maxLength={50} required className="form-control" id="shares" name="shares" value={shares} onChange={(e) => setShares(+e.target.value)} />
                </div>
            </div>
            <div className="form-group mx-sm-4 mb-6">
            {
                Object.keys(USER_ADDRESS).map((m: any, index: number) =>{
                    if (m !== account){
                        return(<span key={index}>
                            <input 
                            type="checkbox" 
                            id={`member-checkbox-${index}`} 
                            name="members" value="false" 
                            onChange={(e) => handleOnChange(index, m, USER_ADDRESS[m], e)}  
                            checked={checkedState[index]}/>
                            <label htmlFor={`member-checkbox-${index}`}>&#160;&#160;{USER_ADDRESS[m]}&#160;&#160;</label><br/>
                        </span>)
                    }
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