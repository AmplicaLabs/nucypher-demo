import React, { useState } from "react";
import { providers } from "ethers";
import type { PolicyMessageKit } from "@nucypher/nucypher-ts";
import Message from "./Message";

function Messages({ account, groups}: any){

    function getRow(group: any, index: number) {
        return(group.messages.map((m: any,i: number)=><Message key={i} index={i} group={group} message={m}/>));
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