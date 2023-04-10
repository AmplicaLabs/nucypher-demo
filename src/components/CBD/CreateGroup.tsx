import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { CheckCircleFill, Circle } from 'react-bootstrap-icons';
import { 
    DEFAULT_SHARES,
    DEFAULT_THRESHOLD,
    GROUP_CREATING,
    GROUP_DEPLOYING_ON_POLYGON,
    GROUP_URSULAS_RECEIVED,
    NUMBER_OF_ACCOUNTS, USER_ADDRESS 
} from "./constants";
const groupCreateMessages = [GROUP_CREATING, GROUP_URSULAS_RECEIVED, GROUP_DEPLOYING_ON_POLYGON];

function CreateGroup({ account, doneStatuses,isGroupCreating, show, handleClose, createNew, ursulaAddresses }: any){
    const [groupName, setGroupName] = useState<string>("");
    const [threshold, setThreshold] = useState<number>(DEFAULT_THRESHOLD);
    const [shares, setShares] = useState<number>(DEFAULT_SHARES);
    const [checkedState, setCheckedState] = useState(
        new Array(NUMBER_OF_ACCOUNTS - 1).fill(false)
    );
    const [selectedMembers, setSelectedMembers] = useState<any>([]);
    
    useEffect(() => {
        if (isGroupCreating === false) {
            setThreshold(DEFAULT_THRESHOLD);
            setShares(DEFAULT_SHARES);
            setGroupName("");
            setCheckedState(new Array(NUMBER_OF_ACCOUNTS - 1).fill(false));
        }
    },[isGroupCreating])

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

    return(<Modal show={show} onHide={handleClose} size={"lg"} animation={false}>
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
            <div className="form-group row">
                <label htmlFor="members" className="col-sm-2 col-form-label" >Members:</label>
                <div className="col-sm-10">
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
            <div className="form-group row create-group-custom-row">
                {groupCreateMessages.map((stMsg, i) =>{
                return <div key={i} className="create-group-address-list-row">
                        {doneStatuses[i] === true? 
                            <CheckCircleFill className="text-success"></CheckCircleFill>
                            :<Circle></Circle>}&#160;{stMsg}
                    </div>
                })}
                {ursulaAddresses != "" &&
                <div className="create-group-address-list-row"><br/><br/>
                    <label className="">Ursula Addresses:</label>
                    <div className="cg-address-list-items row">
                        { ursulaAddresses.map(
                            (adr: string, i: number) => 
                                <div key={i} className="col-md-12">{adr}<br/></div>
                            )
                        }
                    </div>
                </div>}
            </div>
        </div>
        </Modal.Body>
        <Modal.Footer>
          
          <Button className="site-head-right-btn site-btn__border" onClick={handleClose}>
            Close
          </Button>
          <Button disabled={isGroupCreating} className="site-head-right-btn" onClick={() => handleNewGroup()}>
            {isGroupCreating? "Creating new...": "Create New"}
          </Button>
        </Modal.Footer>
      </Modal>)
}

export default CreateGroup;