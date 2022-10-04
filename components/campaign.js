import campaignAbi from '../utils/campaign_abi.json'
import web3 from "../pages/web3";

export default function Campaign(address) {
    return new web3.eth.Contract(campaignAbi, address)
}


