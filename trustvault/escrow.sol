// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {
    address public buyer; // person paying the amount
    address public seller; // person receiving the amount
    uint public amount; // amount to be paid
    bool public confirmed; // if it the deal was done: CONFIRM WITH TEAM HOW THE CONFIRMATION IS DONE
    bool public buyerConfirmed; //HELPER OF CONFIRMED 1
    bool public sellerConfirmed; //HELPER OF CONFIRMED 2
    uint public deadline; //timestamp for the refund or confirmation

    // events
    event Deposited(address indexed from, uint value); //MONEY IS DEPOSITED FROM BUYER
    event Confirmed(
        address indexed by,
        bool buyerConfirmed,
        bool sellerConfirmed
    );
    event Released(uint value); // VALUE TO BE SEBT
    event Refunded(uint value); //

    constructor(address _seller, uint _durationSeconds) payable {
        buyer = msg.sender;
        seller = _seller;
        amount = msg.value;
        deadline = block.timestamp + _durationSeconds;
        require(amount > 0, "Send money to escrow");
        emit Deposited(msg.sender, amount);
    }

    function confirmTransaction() public {
        require(
            msg.sender == buyer || msg.sender == seller,
            "Only the people involved in the transaction can confirm the Escrow"
        );

        if (msg.sender == buyer) {
            buyerConfirmed = true;
        } else {
            sellerConfirmed = true;
        }

        confirmed = buyerConfirmed && sellerConfirmed;

        emit Confirmed(msg.sender, buyerConfirmed, sellerConfirmed);
    }

    function confirmLease() public {
        require(
            msg.sender == buyer || msg.sender == seller,
            "Only buyer or seller can confirm lease"
        );

        if (msg.sender == buyer) {
            buyerConfirmed = true;
        } else {
            sellerConfirmed = true;
        }

        confirmed = buyerConfirmed && sellerConfirmed;
        emit Confirmed(msg.sender, buyerConfirmed, sellerConfirmed);
    }

    function releaseFunds() public {
        require(msg.sender == buyer || msg.sender == seller, "Unauthorized");
        require(confirmed, "Lease not confirmed");
        uint finalsellerAmount = amount;

        amount = 0;
        confirmed = false;

        (bool success, ) = seller.call{value: finalsellerAmount}("");
        require(success, "Transfer failed");

        emit Released(finalsellerAmount);
    }

    function refund() public {
        require(msg.sender == buyer, "Only buyer can refund");
        require(!confirmed, "Already confirmed");
        require(block.timestamp >= deadline, "Too early to refund");

        uint refundAmount = amount;
        amount = 0;
        confirmed = false;

        (bool success, ) = buyer.call{value: refundAmount}("");
        require(success, "Refund failed");

        emit Refunded(refundAmount);
    }
}
