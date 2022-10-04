import React, { useState } from 'react'
import { Button, Form, Message, Input } from 'semantic-ui-react'
import Campaign from './campaign'
import web3 from '../pages/web3'
import { useRouter } from 'next/router'

function ContributeForm({ address }) {
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()
  const handleSubmit = async (ev) => {
    ev.preventDefault()
    try {
      setLoading(true)
      const accounts = await web3.eth.getAccounts()
      const campaign = Campaign(address)
      await campaign.methods.contribute().send({
        from: accounts[0],
        gas: '3000000',
        value: web3.utils.toWei(amount, 'ether'),
      })
      setLoading(false)
      setAmount(0)
      router.replace(`/campaigns/${address}`)
    } catch (err) {
      setLoading(false)
      setErrorMsg(err.message)
    }
  }
  return (
    <Form onSubmit={handleSubmit} error={!!errorMsg}>
      <Form.Field>
        <label>Contribute to this Campaign</label>
        <Input
          label={{ basic: true, content: 'ETH' }}
          labelPosition='right'
          placeholder='Ether'
          onChange={(e) => setAmount(e.target.value)}
        />
      </Form.Field>
      {!!errorMsg && (
        <Message negative>
          <Message.Header>{errorMsg}</Message.Header>
        </Message>
      )}
      {loading ? (
        <Button loading type='submit'>
          Contribute
        </Button>
      ) : (
        <Button type='submit'>Contribute</Button>
      )}{' '}
    </Form>
  )
}

export default ContributeForm
