const Jobs = artifacts.require('Jobs')

contract('Jobs', (accounts) => {
  let jobs = null
  before(async () => {
    jobs = await Jobs.deployed()
  })

  it('Should Post a job', async () => {
    await jobs.postJob('The description', 10000, 500)
    job = await jobs.getJob(0)
    assert.equal(job[0], 1)
    assert.equal(job[1], 'The description')
    assert.equal(job[2], 10000)
    assert.equal(job[3], 500)
  })

  it('Should Post a bid', async () => {
    await jobs.postBid(0, accounts[0], 'Bid description', 9900, 25)
    bid = await jobs.getBid(0)
    assert(bid[0], 0)
    assert(bid[1], 'Bid description')
    assert(bid[2], 9900)
  })
})
