// //to Demo NuCypher CBD using Groups
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract SimpleGroupsMngmt {
    
    struct Group {
        address owner;
        address[] members;
    }
    
    mapping (int32 => Group) public groups;
    int32 public nextGroupId = 1;
    
    event GroupCreated(int32 groupId, address owner, address[] members);
    event MemberAdded(int32 groupId, address member);
    event MemberRemoved(int32 groupId, address member);
    
    function createGroup(address[] memory members) public returns (int32) {
        Group storage group = groups[nextGroupId];
        group.owner = msg.sender;
        group.members = members;
        emit GroupCreated(nextGroupId, msg.sender, members);
        nextGroupId += 1;
        return nextGroupId - 1;
    }
    
    function addMember(int32 groupId, address member) public {
        Group storage group = groups[groupId];
        require(msg.sender == group.owner, "Only group owner can add members.");
        group.members.push(member);
        emit MemberAdded(groupId, member);
    }
    
    function removeMember(int32 groupId, address member) public {
        Group storage group = groups[groupId];
        require(msg.sender == group.owner, "Only group owner can remove members.");
        for (uint32 i = 0; i < group.members.length; i++) {
            if (group.members[i] == member) {
                group.members[i] = group.members[group.members.length - 1];
                group.members.pop();
                emit MemberRemoved(groupId, member);
                return;
            }
        }
        revert("Member not found in group.");
    }
    
    function isMember(int32 groupId, address account) public view returns (bool) {
        Group storage group = groups[groupId];
        for (uint32 i = 0; i < group.members.length; i++) {
            if (group.members[i] == account) {
                return true;
            }
        }
        return false;
    }
}