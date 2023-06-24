import { useContext, useState } from 'react';
import { X } from 'react-bootstrap-icons';
import { Form, InputGroup, Row, Col, Button, Badge, Spinner, Card, ListGroup } from 'react-bootstrap';

import { EthersContext } from "../utils/EthersContext";
import { checkWalletNetwork } from "../utils/Wallet";

const Trade = () => {  

    const { isConnected, signer, contracts: { token } } = useContext(EthersContext);

    const [inId, setInId] = useState("");
    const [outId, setOutId] = useState("");
    const [amount, setAmount] = useState("");
    const [txHash, setTxHash] = useState("");
    const [blockNo, setBlockNo] = useState("");
    const [error, setError] = useState("");

    const checkParamaters = async () => {   

        if (inId === "" || outId === "" || amount === "") {
            setError("Fill in the empty fields.");
            return false;
        }

        if (amount < 1) {
            setError("Amount must be a positive integer.");
            return false;
        }

        if (outId > 2) {
            setError("Cannot receive tokens with id higher than 2.");
            return false;
        }

        if (inId === outId) {
            setError("Cannot trade the same tokens.");
            return false;
        }

        const balance = await token.balanceOf(signer.address, inId);

        if (balance < amount) {
            setError("Insufficient balance to trade.");
            return false;
        }

        return true;
    }

    const trade = async () => {  

        try {    

            const tx = await token.trade(inId, outId, amount);

            setTxHash(tx.hash);
            
            const rec = await tx.wait();

            setBlockNo(rec.blockNumber);

        } catch (e) {
            console.log(e);
        }
    }

    const tradeButton = (
        <Button size="lg" disabled={!isConnected} onClick={async () => {
                
            if (await checkWalletNetwork() && await checkParamaters()) {               
                
                setError("");

                trade();
            }
        }}>
            { txHash !== "" && blockNo === ""  ?
                <Spinner animation="border" variant="light" /> :
                <>Trade</>
            }
        </Button>
    );

    const errorMessage = (
        error === "" ?
            <></> :
            <Badge bg="danger">
                { error }
            </Badge>
    );

    const txInfo = (
        txHash !== "" ?
            <Card style={{ width: '45rem' }}>
                <Card.Header>{ blockNo === "" ? <>Trading...</> : <>Traded</> }</Card.Header>
                <ListGroup variant="flush">
                <ListGroup.Item><i>Transaction Hash: <a target="_blank" href={`https://mumbai.polygonscan.com/tx/${txHash}`}>
                    {txHash}
                </a></i></ListGroup.Item>
                { blockNo !== "" ? 
                    <ListGroup.Item><i>Transaction is mined in block <a target="_blank" href={`https://mumbai.polygonscan.com/block/${blockNo}`}>
                        { blockNo }
                    </a></i></ListGroup.Item> :
                    <></>
                }
                </ListGroup>
            </Card> :
            <></> 
    );

    const tradeInfo = (
        <Card bg="secondary" text="white" style={{ width: '45rem' }}>
            <Card.Body><i>
                Any Forgeum token can be traded for tokens with IDs of 0, 1, and 2.<br/>
                Specify how many of which token you would like to send in return for which token, below.<br/>
                Trading enables you to mint tokens without waiting for the cooldown period <br/>
                but at the expense of burning some other tokens. 
            </i></Card.Body>
        </Card>
    );

    const inputTriple = (
        <Row>
            <Col sm={2}>
                <InputGroup className="mb-3" size="lg">
                    <Form.Control
                        type="number"
                        placeholder="Amount"
                        value={ amount }
                        onChange={(e) =>  { setAmount(e.target.value) }}
                    />
                    <InputGroup.Text id="basic-addon1"><X size={25}/></InputGroup.Text>
                </InputGroup>
            </Col>
            <Col sm={3}>
                <InputGroup className="mb-3" size="lg">
                    <InputGroup.Text id="basic-addon1">ID : </InputGroup.Text>
                    <Form.Control
                        type="number"
                        placeholder="Send"
                        value={ inId }
                        onChange={(e) =>  { setInId(e.target.value) }}
                    />
                </InputGroup>
            </Col>
            <Col sm={3}>
                <InputGroup className="mb-3" size="lg">
                    <InputGroup.Text id="basic-addon1">ID : </InputGroup.Text>
                    <Form.Control
                        type="number"
                        placeholder="Receive"
                        value={ outId }
                        onChange={(e) =>  { setOutId(e.target.value) }}
                    />
                </InputGroup>
            </Col>
        </Row>
    );

    return (
        <div>
            <h1>Trade Tokens</h1><br/>
            { tradeInfo }
            <br/>{ errorMessage }<br/><br/>
            <Row>
                <Col className="align-items-center">
                    { inputTriple }
                    { tradeButton }
                </Col>   
            </Row>
            <br/>
            { txInfo }
        </div>
    );
}

export default Trade;