import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { Button, Form, Grid, Input, Message } from 'semantic-ui-react'
import web3 from '../web3'
import abi from '../../utils/abi.json'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

const New = () => {
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setLoading(true)
    setErrorMsg('')
    // all accounts
    const accounts = await web3.eth.getAccounts()
    try {
      // create a campaign
      const campaign = new web3.eth.Contract(
        abi,
        '0xB20f2B24d5040770495b17007715efdDA5448554'
      )
      await campaign.methods.createCampaign().send({
        from: accounts[0],
      })
      setLoading(false)
      await router.push('/')
    } catch (err) {
      setLoading(false)

      setErrorMsg(err.message)
    }
  }
  return (
    <Layout>
      <NextSeo
        title='CrownCoin|New Campaign'
        description='Create a new Campaign.'
      />
      <Grid>
        <Grid.Row centered columns={2}>
          <Grid.Column>
            <h3>New Campaign</h3>
            <Form onSubmit={handleSubmit} error={!!errorMsg}>
              {!!errorMsg && (
                <Message negative>
                  <Message.Header>{errorMsg}</Message.Header>
                </Message>
              )}
              {loading ? (
                <Button loading type='submit'>
                  Create Campaign
                </Button>
              ) : (
                <Button type='submit'>Create Campaign</Button>
              )}
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  )
}

export default New
