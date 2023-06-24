import { useContext, useState, useEffect } from 'react';
import { X } from 'react-bootstrap-icons';
import { Form, InputGroup, Row, Col, ToggleButton, Button, Badge, Spinner, Card, ListGroup } from 'react-bootstrap';

import { EthersContext } from "../utils/EthersContext";
import { checkWalletNetwork } from "../utils/Wallet";
import { reactionFormula, multiliedReactionFormula } from '../utils/Formulas';

const Forge = () => {  

    const { isConnected, getBalances, ruleEvents, contracts: { forger, token } } = useContext(EthersContext);

    const [multiplier, setMultiplier] = useState(1);
    const [isMultiplied, setIsMultiplied] = useState(false);
    const [selectedForge, setSelectedForge] = useState();
    const [txHash, setTxHash] = useState("");
    const [blockNo, setBlockNo] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {

    }, [multiplier, selectedForge]);

    const checkParamaters = async () => {

        if (multiplier < 1) {
            setError("Multiplier must be a positive integer.");
            return false;
        }

        if (selectedForge.length === 0) {
            setError("You must select a forging reaction.");
            return false;
        }

        const { inIds, inAmounts } = selectedForge;

        const balances = await getBalances(inIds);

        if (inIds.filter((id, i) => balances[i] < multiplier * inAmounts[i]).length !== 0) {
            setError("Insufficient balance to forge.");
            return false;
        }

        return true;
    }

    const forge = async () => {

        try {    

            let tx;

            const { inIds, inAmounts, outIds, outAmounts } = selectedForge;

            if (multiplier === 1) {

                tx = await forger.forge(inIds, inAmounts, outIds, outAmounts);
            
            } else {

                tx = await forger["forge(uint[],uint[],uint[],uint[],uint)"](inIds, inAmounts, outIds, outAmounts, multiplier);
            }

            setTxHash(tx.hash);
            
            const rec = await tx.wait();

            setBlockNo(rec.blockNumber);

        } catch (e) {
            console.log(e);
        }
    }

    const forgeButton = (
        <Button size="lg" disabled={!isConnected} onClick={async () => {
                
            if (await checkWalletNetwork() && await checkParamaters()) {
                
                setError("");

                forge();
            }
        }}>
            { txHash !== "" && blockNo === ""  ?
                <Spinner animation="border" variant="light" /> :
                <>Forge</>
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
                <Card.Header>{ blockNo === "" ? <>Forging...</> : <>Forged</> }</Card.Header>
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

    const forgeInfo = (
        <Card bg="secondary" text="white" style={{ width: '50rem' }}>
            <Card.Body><i>
                Forging refers to the process of burning tokens to mint new ones through the specified reaction rules.<br/>
                This forging process is performed by the Forger contract, which has special mint privilidges <br/>in Forgeum ERC-1155 contract.
                You can select a reaction below whose ingredients you already possess, and multiply a reaction as a convinient way of
                performing the same forge multiple times.    
            </i></Card.Body>
        </Card>
    );

    const toggleIsMultiplied = (
        <ToggleButton
            className="mb-2"
            id="toggle-check"
            type="checkbox"
            variant="outline-primary"
            checked={isMultiplied}
            value="1"
            onChange={(e) => setIsMultiplied(e.currentTarget.checked)}
        >
            Multiplied
        </ToggleButton>
    );

    const inputSelect = (
        <Row sm={8}>
            { isMultiplied ? 
                <Col sm={2}>
                    <InputGroup className="mb-3" size="lg">
                        <Form.Control
                            type="number"
                            placeholder="Multiplier"
                            value={ multiplier }
                            onChange={(e) =>  { 
                                setMultiplier(e.target.value); 
                            }}
                        />
                        <InputGroup.Text id="basic-addon1"><X size={25}/></InputGroup.Text>
                    </InputGroup>
                </Col> :
                <></>
            }
            <Col sm={5}>

                <Form.Select onChange={(e) => setSelectedForge(ruleEvents[e.target.value])} size="lg">

                    { ruleEvents.length ?
                        <><option>Select Forging Reaction</option>{
                        ruleEvents.map((ruleEvent, i) => {
                            return <option value={i} key={i}>{reactionFormula(ruleEvent)}</option>
                        })
                        }</> :
                        <></> 
                    }
                </Form.Select>
            </Col>
        </Row>
    );

    const multipliedRaction = (
        isMultiplied && selectedForge !== undefined && multiplier > 0 ? 
            <Col sm={6}>
                <InputGroup className="mb-3" size="lg">
                    <InputGroup.Text id="basic-addon1">=</InputGroup.Text>
                    <Form.Control
                        value={ multiliedReactionFormula(multiplier, selectedForge) }
                    />
                </InputGroup>
            </Col> :
            <></>
    );

    return (
        <div>
            <h1>Forge Tokens</h1><br/>
            { forgeInfo }
            <br/>{ errorMessage }<br/><br/>
            <Row>
                <Col className="align-items-center">
                    { toggleIsMultiplied }
                    { inputSelect }
                    { multipliedRaction }
                    <br/>
                    { forgeButton }
                </Col>  
            </Row>
            <br/>
            { txInfo }
        </div>
    );
}

export default Forge;