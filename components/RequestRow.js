import React from 'react'
import { Button, Table } from 'semantic-ui-react'
import web3 from '../pages/web3'
import Campaign from './campaign'
const RequestRow = ({ request, id, approversCount, address }) => {
  const readyToFinalize = request.approvalCount > approversCount / 2
  const onApprove = async () => {
    const campaign = Campaign(address)
    const accounts = await web3.eth.getAccounts()
    await campaign.methods.approveRequest(id).send({
      from: accounts[0],
      gas: '3000000',
    })
  }
  const onFinalize = async () => {
    try {
      const campaign = Campaign(address)
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.finalizeRequest(id).send({
        from: accounts[0],
        gas: '1000000',
      })
    } catch (err) {
      console.log(err.message)
    }
  }
  return (
    <>
      <Table.Row positive={readyToFinalize && !request.complete}>
        <Table.Cell>{id + 1}</Table.Cell>
        <Table.Cell>{request.description}</Table.Cell>
        <Table.Cell>
          {web3.utils.fromWei(request.value, 'ether') + ' ETH'}
        </Table.Cell>
        <Table.Cell>{request.recipient}</Table.Cell>
        <Table.Cell>
          {request.approvalCount}/{approversCount}
        </Table.Cell>
        <Table.Cell>
          {!request.complete && (
            <Button onClick={onApprove} color='green' basic>
              Approve
            </Button>
          )}
        </Table.Cell>
        <Table.Cell>
          {!request.complete && (
            <Button onClick={onFinalize} color='gray' basic>
              Finalize
            </Button>
          )}
        </Table.Cell>
      </Table.Row>
    </>
  )
}

export default RequestRow
