import { Card } from 'react-bootstrap';
import { useContext } from 'react';
import { EthersContext } from "../utils/EthersContext";

const Home = () => {

    const { contracts: { forger, token } } = useContext(EthersContext);

    const link = (contract) => {

        const address = contract !== "" ? contract.runner.address : "";

        return `https://mumbai.polygonscan.com/address/${address}`;
    }

    return (
        <div>
            <h1>Forgeum: on-chain token forging</h1><br/>
            <Card bg="secondary" text="white" style={{ width: "65rem" }}>
                <Card.Body style={{ fontSize: "20px"}}><i>
                    <a style={{ color: "white"}} target="_blank" href={link(token)}>Forgeum</a> is an <a style={{ color: "white"}} target="_blank" href="https://docs.openzeppelin.com/contracts/3.x/erc1155">ERC-1155</a> contract 
                    tied with a <a style={{ color: "white"}} target="_blank" href={link(forger)}>Forger</a> contract 
                    that enables users to forge tokens into new ones.<br/>
                    Forging refers to the process of burning tokens to mint new ones through the 
                    specified <a style={{ color: "white"}} href="/reactions">reaction rules</a>.<br/>
                    You can mint some free-to-mint tokens, burn or trade them, 
                    <br/>as well as forge them to earn new ones that you cannot mint yourself.<br/>
                    You can also view your account info and keep track of the balances of your 
                    Forgeum tokens  <a style={{ color: "white"}} href="/profile">here</a>. 
                </i></Card.Body>
            </Card><br/>
            <Card bg="secondary" text="white" style={{ width: "50rem" }}>
                <Card.Body style={{ fontSize: "20px"}}><i>
                    Altough every operation of Forgeum is free of charge,<br/>you still need to have a small amount of test matic to pay for the transaction gas costs.<br/>
                    If you don't already have any in your wallet, use <a style={{ color: "white"}} target="_blank" href="https://faucet.polygon.technology/">this faucet</a> to get some for free. 
                </i></Card.Body>
            </Card><br/>
            <Card bg="secondary" text="white" style={{ width: "25rem" }}>
                <Card.Body style={{ fontSize: "20px"}}><i>
                    See the code of the contracts <a style={{ color: "white"}} target="_blank" href="https://github.com/furkanaktepe01/Forgeum">here</a>. 
                </i></Card.Body>
            </Card>
        </div>
    );
}

export default Home;