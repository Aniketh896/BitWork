pragma solidity ^0.5.0;

contract Jobs{
    
    Job public job;
    Bid public bid;
    Escrow escrow;
    struct Job{
        address client;
        string description;
        uint256 price;
        uint256 due_date;
    }
    
    struct Bid{
        address payable freelancer;
        string bid_description;
        uint bid_price;
        uint256 days_required;
        bool accepted;
        string data_url;
        uint256 completed_on;
        bool paid;
    }

    
    function postJob(
        string memory _description,
        uint256 _price,
        uint256 _due_date
    ) 
    public
    {
        job = Job(
            msg.sender,
            _description, 
            _price, 
            _due_date
        );
    }
    
    function postBid(
        string memory _bid_description,
        uint _bid_price,
        uint256 _days_required
    ) 
    public
    {
        bid = Bid(
            msg.sender, 
            _bid_description, 
            _bid_price, 
            _days_required, 
            false, 
            "null", 
            0,
            false
        );
    }
    
    function acceptBid(
    )
    public
    {   
        escrow  = new Escrow (job.client, bid.freelancer);
        bid.accepted = true;
        makePayment();
    }
    
    function makePayment() public{
        escrow.confirmPayment();
    }
    
    function postProjectSubmission(
        string memory _data_url, 
        uint256 _completed_on
    )
    public
    {
        bid.data_url = _data_url;
        bid.completed_on = _completed_on;
    }
    
    function acceptProjectSubmission (
    )
    public payable{
        escrow.confirmDelivery();
        bid.paid = true;
    }
}

contract Escrow {
    enum State {AWAITING_PAYMENT, AWAITING_DELIVERY, COMPLETE}
    State currentState;
    
    address buyer;
    address payable seller;
    
    constructor (address _buyer, address payable _seller) public{
        buyer = _buyer;
        seller = _seller;
    }
        
    modifier buyerOnly() { require(tx.origin == buyer); _;}
    modifier inState(State expectedState){ require(currentState == expectedState); _;}
    
    function confirmPayment() buyerOnly inState(State.AWAITING_PAYMENT) public payable{
        currentState = State.AWAITING_DELIVERY;
    }
    
    function confirmDelivery() buyerOnly inState(State.AWAITING_DELIVERY) public{
        seller.transfer(address(this).balance);
        currentState = State.COMPLETE;
    }
}