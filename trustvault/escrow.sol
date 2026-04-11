// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {
    address public buyer;
    address public seller;
    uint public amount;
    bool public confirmed;
    bool public buyerConfirmed;
    bool public sellerConfirmed;
    uint public deadline;

    // Rating system
    mapping(address => uint) public totalRatings;
    mapping(address => uint) public numRatings;

    bool public buyerRated;
    bool public sellerRated;

    // events
    event Deposited(address indexed from, uint value);
    event Confirmed(
        address indexed by,
        bool buyerConfirmed,
        bool sellerConfirmed
    );
    event Released(uint value);
    event Refunded(uint value);
    event Rated(address indexed from, address indexed to, uint rating);

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
            "Only participants can confirm"
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
        require(confirmed, "Not confirmed");

        uint finalSellerAmount = amount;

        amount = 0;
        confirmed = false;

        (bool success, ) = seller.call{value: finalSellerAmount}("");
        require(success, "Transfer failed");

        emit Released(finalSellerAmount);
    }

    function refund() public {
        require(msg.sender == buyer, "Only buyer can refund");
        require(!confirmed, "Already confirmed");
        require(block.timestamp >= deadline, "Too early");

        uint refundAmount = amount;

        amount = 0;
        confirmed = false;

        (bool success, ) = buyer.call{value: refundAmount}("");
        require(success, "Refund failed");

        emit Refunded(refundAmount);
    }

    //NEW: Rating function
    function rate(uint _rating) public {
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");
        require(amount == 0, "Transaction not completed");

        if (msg.sender == buyer) {
            require(!buyerRated, "Buyer already rated");

            totalRatings[seller] += _rating;
            numRatings[seller] += 1;

            buyerRated = true;

            emit Rated(buyer, seller, _rating);
        } else if (msg.sender == seller) {
            require(!sellerRated, "Seller already rated");

            totalRatings[buyer] += _rating;
            numRatings[buyer] += 1;

            sellerRated = true;

            emit Rated(seller, buyer, _rating);
        } else {
            revert("Not part of this escrow");
        }
    }

    // View average rating of a user
    function getAverageRating(address user) public view returns (uint) {
        if (numRatings[user] == 0) return 0;
        return totalRatings[user] / numRatings[user];
    }
}
