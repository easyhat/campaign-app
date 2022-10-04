import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import Campaign from '../../components/campaign'
import { Button, Card, Grid } from 'semantic-ui-react'
import web3 from '../web3'
import ContributeForm from '../../components/ContributeForm'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
const Address = () => {
  const router = useRouter()
  const { address } = router.query
  const [summary, setSummary] = useState({})
  const connectCampaign = async () => {
    const campaign = Campaign(address)
    const mySummary = await campaign.methods.getSummary().call()
    setSummary(mySummary)
  }
  const renderSummary = () => {
    const minimumContribution = summary[0]
    const balance = summary[1]
    const requests = summary[2]
    const approvesCount = summary[3]
    const manager = summary[4]
    const items = [
      {
        header: manager,
        meta: 'Address of manager.',
        description:
          'The manager created this campaign and can create requests to withraw money.',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: minimumContribution,
        meta: 'minimum Contribution (Wei).',
        description:
          'You must to contribute at least this much of Wei to become an approver.',
      },
      {
        header: requests,
        meta: 'Number of Requests.',
        description:
          'A request tries to withdraw money from the contract. Requests must be approved by approvers.',
      },
      {
        header: approvesCount,
        meta: 'Number of Approvers.',
        description:
          'Number of people who have already donated to this campaign.',
      },
      {
        header: balance,
        meta: 'Campaign Balance (Ether)',
        description:
          'The balance how much money this campaign has left to spend.',
      },
    ]

    return items
  }

  useEffect(() => {
    connectCampaign().catch((err) => {
      process.exitCode = 1
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Layout>
      <NextSeo
        title='CrownCoin|Campaign'
        description='Display all information about a campaign.'
      />
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}>
            <Card.Group items={renderSummary()} />
          </Grid.Column>
          <Grid.Column width={4}>
            <ContributeForm address={address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/requests/${address}/`}>
              <Button primary style={{ margingTop: '5px' }}>
                View Requests
              </Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  )
}

export default Address
