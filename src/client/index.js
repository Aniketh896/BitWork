import Web3 from 'web3';
import JobsJSON from '../build/contracts/Jobs.json';

let web3;
let jobs;

const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    if(typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      window.ethereum.enable()
        .then(() => {
          resolve(
            new Web3(window.ethereum)
          );
        })
        .catch(e => {
          reject(e);
        });
      return;
    }
    if(typeof window.web3 !== 'undefined') {
      return resolve(
        new Web3(window.web3.currentProvider)
      );
    }
    resolve(new Web3('http://localhost:9545'));
  });
};

const initContract = () => {
  const deploymentKey = Object.keys(JobsJSON.networks)[0];
  return new web3.eth.Contract(
    JobsJSON.abi, 
    JobsJSON
      .networks[deploymentKey]
      .address,
    { gas: 300000 }
  );
};

const initApp = () => {
  const $createPost = document.getElementById('createPost');
  const $description = document.getElementById('description-1');
  const $price = document.getElementById('price-1');
  const $dueDate = document.getElementById('due-date-1');
  const $createBid = document.getElementById('createBid');
  const $currentBid = document.getElementById('currentBid');
  const $bidTitle = document.getElementById('bid-title-1');
  const $bidDescription = document.getElementById('bid-description-1');
  const $daysRequired = document.getElementById('days-required-1');
  const $bidPrice = document.getElementById('bid-price-1');
  const $bidAccepted = document.getElementById('bid-accepted-1');
  const $acceptBid = document.getElementById('acceptBid');

  let accounts = [];

  web3.eth.getAccounts()
    .then(_accounts => {
      accounts = _accounts;
    });
    

    $createPost.addEventListener("submit", e => {
      e.preventDefault();
      const description = e.target.elements[0].value;
      const price = e.target.elements[1].value;
      const dueDate = Date.parse(e.target.elements[2].value);
      jobs.methods
        .postJob(description, price, dueDate)
        .send({from: accounts[0]})
        .then(() => {
          $description.innerHTML = description;
          $price.innerHTML = price;
          $dueDate.innerHTML = new Date(dueDate).toDateString();
        })
        .catch(err => {
          console.error(err)
        });
    }); 

  $createBid.addEventListener('submit', (e) => {
    e.preventDefault();
    const jobId = e.target.elements[0].value;
    const bidDescription = e.target.elements[1].value;
    const bidPrice = e.target.elements[2].value;
    const daysRequired = e.target.elements[3].value;

    jobs.methods
      .postBid(bidDescription, bidPrice, daysRequired)
      .send({from: accounts[0]})
      .then(() => {
        const bidPromise = jobs.methods.bid().call();
        bidPromise.then(bid => {
          console.log(bid);
          $bidTitle.innerHTML = "Bid TITLE";
          $bidDescription.innerHTML = bid.bid_description;
          $bidPrice.innerHTML = bid.bid_price;
          $daysRequired.innerHTML = bid.days_required;
        });
      })
      .catch(e => {
        console.error(e);
      })
  });

  let finalBid;

  $acceptBid.addEventListener('click', (e) => {
    e.preventDefault();
    const now = 1592740240;
    const bidPromise = jobs.methods.bid().call();
        bidPromise.then(bid => {
          console.log(bid);
          finalBid = bid.bid_price
          jobs.methods
            .acceptBid()
            .send({ from: accounts[0] })
            .then(() => {
              console.log("Bid accepted.")
              jobs.methods
                .postProjectSubmission('url', now)
                .send({ from: accounts[0] })
                .then(() => {
                  console.log("Project Submitted");
                  jobs.methods
                    .acceptProjectSubmission()
                    .send({ from: accounts[0], value: finalBid })
                    .then(() => {
                      console.log("Payment accepted");
                      $bidAccepted.innerHTML = "Accepted"
                    })
                })
            })
        });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initWeb3()
    .then(_web3 => {
      web3 = _web3;
      jobs = initContract();
      initApp();
    })
    .catch(error => console.log(error.message));
});
