// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Escrow contract that allows a buyer to deposit funds,
// both parties to confirm, and then release or refund funds.
// Also includes a simple rating system between buyer and seller.
contract Escrow {
    // Address of the buyer (who deploys and sends ETH)
    address public buyer;

    // Address of the seller (receives ETH after confirmation)
    address public seller;

    // Amount of ETH locked in the escrow
    uint public amount;

    // True when both buyer and seller have confirmed the transaction
    bool public confirmed;

    // Tracks if buyer has confirmed
    bool public buyerConfirmed;

    // Tracks if seller has confirmed
    bool public sellerConfirmed;

    // Deadline timestamp after which buyer can request refund
    uint public deadline;

    // -------------------- Rating system --------------------

    // Total sum of ratings received by each address
    mapping(address => uint) public totalRatings;

    // Number of ratings received by each address
    mapping(address => uint) public numRatings;

    // Prevents buyer from rating more than once
    bool public buyerRated;

    // Prevents seller from rating more than once
    bool public sellerRated;

    // -------------------- Events --------------------

    // Emitted when buyer deposits ETH into escrow
    event Deposited(address indexed from, uint value);

    // Emitted when either party confirms the transaction
    event Confirmed(
        address indexed by,
        bool buyerConfirmed,
        bool sellerConfirmed
    );

    // Emitted when funds are released to seller
    event Released(uint value);

    // Emitted when funds are refunded to buyer
    event Refunded(uint value);

    // Emitted when a rating is submitted
    event Rated(address indexed from, address indexed to, uint rating);

    // -------------------- Constructor --------------------

    // Initializes the contract with seller and deadline
    // Buyer is the one deploying the contract and sending ETH
    constructor(address _seller, uint _durationSeconds) payable {
        buyer = msg.sender; // deployer becomes buyer
        seller = _seller; // seller is provided
        amount = msg.value; // ETH sent at deployment
        deadline = block.timestamp + _durationSeconds; // refund deadline

        // Ensure some ETH was sent
        require(amount > 0, "Send money to escrow");

        // Emit deposit event
        emit Deposited(msg.sender, amount);
    }

    // -------------------- Transaction Confirmation --------------------

    // Allows buyer or seller to confirm the transaction
    function confirmTransaction() public {
        // Only buyer or seller can call this
        require(
            msg.sender == buyer || msg.sender == seller,
            "Only participants can confirm"
        );

        // Mark confirmation depending on who called
        if (msg.sender == buyer) {
            buyerConfirmed = true;
        } else {
            sellerConfirmed = true;
        }

        // Transaction is confirmed only if both approved
        confirmed = buyerConfirmed && sellerConfirmed;

        // Emit confirmation event
        emit Confirmed(msg.sender, buyerConfirmed, sellerConfirmed);
    }

    // -------------------- Release Funds --------------------

    // Sends funds to seller after both parties confirm
    function releaseFunds() public {
        // Only participants can trigger release
        require(msg.sender == buyer || msg.sender == seller, "Unauthorized");

        // Must be confirmed by both parties
        require(confirmed, "Not confirmed");

        // Store amount locally
        uint finalSellerAmount = amount;

        // Reset state BEFORE external call (prevents reentrancy)
        amount = 0;
        confirmed = false;

        // Transfer ETH to seller
        (bool success, ) = seller.call{value: finalSellerAmount}("");
        require(success, "Transfer failed");

        // Emit release event
        emit Released(finalSellerAmount);
    }

    // -------------------- Refund --------------------

    // Allows buyer to get refund if deadline passes and not confirmed
    function refund() public {
        // Only buyer can request refund
        require(msg.sender == buyer, "Only buyer can refund");

        // Cannot refund if already confirmed
        require(!confirmed, "Already confirmed");

        // Must wait until deadline
        require(block.timestamp >= deadline, "Too early");

        // Store refund amount
        uint refundAmount = amount;

        // Reset state
        amount = 0;
        confirmed = false;

        // Send ETH back to buyer
        (bool success, ) = buyer.call{value: refundAmount}("");
        require(success, "Refund failed");

        // Emit refund event
        emit Refunded(refundAmount);
    }

    // -------------------- Rating System --------------------

    // Allows buyer and seller to rate each other (1–5)
    function rate(uint _rating) public {
        // Rating must be between 1 and 5
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");

        // Only allow rating after transaction is completed (amount == 0)
        require(amount == 0, "Transaction not completed");

        // If buyer is rating seller
        if (msg.sender == buyer) {
            // Prevent double rating
            require(!buyerRated, "Buyer already rated");

            // Add rating to seller
            totalRatings[seller] += _rating;
            numRatings[seller] += 1;

            // Mark buyer as having rated
            buyerRated = true;

            // Emit rating event
            emit Rated(buyer, seller, _rating);

            // If seller is rating buyer
        } else if (msg.sender == seller) {
            // Prevent double rating
            require(!sellerRated, "Seller already rated");

            // Add rating to buyer
            totalRatings[buyer] += _rating;
            numRatings[buyer] += 1;

            // Mark seller as having rated
            sellerRated = true;

            // Emit rating event
            emit Rated(seller, buyer, _rating);
        } else {
            // Reject if not part of escrow
            revert("Not part of this escrow");
        }
    }

    // -------------------- View Functions --------------------

    // Returns the average rating of a user
    function getAverageRating(address user) public view returns (uint) {
        // If no ratings, return 0
        if (numRatings[user] == 0) return 0;

        // Return integer average (rounded down)
        return totalRatings[user] / numRatings[user];
    }
}
