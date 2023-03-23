import React, { useState } from "react";
import Message from "./Message";

function Messages({ account, groups, isReset, setIsReset}: any){

    function getRow(group: any, index: number) {
        if(group.messages && group.messages.length >0) {
            return(group.messages.map((m: any,i: number)=>
                <Message key={i} index={i} isReset={isReset} setIsReset={setIsReset} group={group} message={m}/>
            ));
        }
    }

    return(<div className="post-container">
        <div className="row">
            <div className="col-md-6">
                Messages
            </div>
        </div>
        <div className="row">
            <div className="col-md-12">
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            Group
                        </th>
                        <th>Sender</th>
                        <th>Encrypted Message</th>
                        <th>Decrypted Message</th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map((g: any,i: number) => getRow(g, i))}
                </tbody>
            </table>
            </div>
        </div>
    </div>)
}

export default Messages;