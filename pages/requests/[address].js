import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import {
  Button,
  Form,
  Message,
  Input,
  Modal,
  Header,
  Table,
} from 'semantic-ui-react'
import { useRouter } from 'next/router'
import Campaign from '../../components/campaign'
import web3 from '../web3'
import RequestRow from '../../components/RequestRow'
import { NextSeo } from 'next-seo'

function Address() {
  const router = useRouter()

  // State
  const [address, setAddress] = useState('')
  const [open, setOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState(0)
  const [recipient, setRecipient] = useState('')
  const [requests, setRequests] = useState([])
  const [requestCount, setRequestCount] = useState(0)
  const [approversCount, setApproversCount] = useState(0)
  const loadRequests = async () => {
    const { address } = router.query
    setAddress(address)
    const campaign = Campaign(address)
    const requestCount = await campaign.methods.getRequestsCount().call()
    const approversCount = await campaign.methods.approversCount().call()
    const myRequests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call()
        })
    )
    setRequests(myRequests)
    setRequestCount(requestCount)
    setApproversCount(approversCount)
  }
  // function
  const handleSubmit = async () => {
    setLoading(true)
    const campaign = Campaign(address)
    const accounts = await web3.eth.getAccounts()

    try {
      await campaign.methods
        .createRequest(
          description,
          web3.utils.toWei(amount, 'ether'),
          recipient
        )
        .send({
          gas: '3000000',
          from: accounts[0],
        })

      // clear form
      clearForm()
    } catch (err) {
      setErrorMsg(err.message)
    }
    setLoading(false)
  }
  // clear form and close Modal
  const clearForm = () => {
    setAmount('0')
    setDescription('')
    setRecipient('')
    setOpen(false)
  }

  useEffect(() => {
    loadRequests().catch((err) => console.error(err.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout>
      <NextSeo
        title='CrownCoin|All Requests'
        description='Display All Requests for a specified campaign.'
      />
      <h3>Requests</h3>
      {/* Modal */}
      <Modal
        closeIcon
        open={open}
        trigger={
          <Button primary floated='right' style={{ marginTop: '-40px' }}>
            New Request
          </Button>
        }
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Header content='Create a Request' />

        <Modal.Content>
          <Form onSubmit={handleSubmit} error={!!errorMsg}>
            <Form.Field>
              <label>Description</label>
              <Input
                placeholder='Description'
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>Amount (Ether)</label>
              <Input
                label={{ basic: true, content: 'ETH' }}
                labelPosition='right'
                placeholder='Ether'
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>Recipient(Address)</label>
              <Input
                placeholder='0x0eD6F26f1e8272a543f7348306aaA2C650b49dF3'
                onChange={(e) => setRecipient(e.target.value)}
              />
            </Form.Field>
            {!!errorMsg && (
              <Message negative>
                <Message.Header>{errorMsg}</Message.Header>
              </Message>
            )}
            {loading ? (
              <Button loading primary type='submit'>
                Create!
              </Button>
            ) : (
              <Button type='submit' primary>
                Create!
              </Button>
            )}{' '}
          </Form>
        </Modal.Content>
      </Modal>
      <Table celled padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Id</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Recipient</Table.HeaderCell>
            <Table.HeaderCell>Approval Count</Table.HeaderCell>
            <Table.HeaderCell>Approve</Table.HeaderCell>
            <Table.HeaderCell>Finalize</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {requests.map((element, index) => {
            return (
              <RequestRow
                key={index}
                id={index}
                request={element}
                address={address}
                approversCount={approversCount}
              />
            )
          })}
        </Table.Body>
      </Table>
      <div>Found {requestCount} Requests.</div>
    </Layout>
  )
}

export default Address
