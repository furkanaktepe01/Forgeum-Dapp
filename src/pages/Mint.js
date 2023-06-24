import { useContext, useState } from 'react';
import { Plus, Dash, X } from 'react-bootstrap-icons';
import { Form, InputGroup, Row, Col, ButtonGroup, Button, Badge, Spinner, Card, ListGroup } from 'react-bootstrap';

import { EthersContext } from "../utils/EthersContext";
import { checkWalletNetwork } from "../utils/Wallet";

const Mint = () => {  

    const { isConnected, signer, contracts: { token } } = useContext(EthersContext);

    const [count, setCount] = useState(1);
    const [ids, setIds] = useState([""]);
    const [amounts, setAmounts] = useState([""]);
    const [txHash, setTxHash] = useState("");
    const [blockNo, setBlockNo] = useState("");
    const [error, setError] = useState("");

    const checkParamaters = () => {   

        if (ids.includes("") || amounts.includes("")) {
            setError("Fill in the empty fields.");
            return false;
        }

        if (ids.length !== new Set(ids).size) {
            setError("Duplicate ids are not allowed.");
            return false;
        }

        if (amounts.filter((amount) => amount < 1).length) {
            setError("Amount must be a positive integer.");
            return false;
        }

        if (ids.filter((id) => id > 2).length) {
            setError("Only tokens with id less than 2 can be minted.");
            return false;
        }

        return true;
    }

    const mint = async () => {  

        try {    

            let tx;

            if (ids.length === 1) {

                tx = await token.mint(ids[0], amounts[0], "0x00");
            
            } else {

                tx = await token.mintBatch(signer.address, ids, amounts, "0x00");
            }

            setTxHash(tx.hash);
            
            const rec = await tx.wait();

            setBlockNo(rec.blockNumber);

        } catch (e) {
            console.log(e);
        }
    }

    const mintButton = (
        <Button size="lg" disabled={!isConnected} onClick={async () => {
                
            if (await checkWalletNetwork() && checkParamaters()) {  
                
                setError("");

                mint();
            }
        }}>
            { txHash !== "" && blockNo === ""  ?
                <Spinner animation="border" variant="light" /> :
                <>Mint</>
            }
        </Button>
    );

    const adjustButton = (
        <ButtonGroup>
            <Button variant="success" onClick={() => {
                setCount(count + 1);
                setIds([...ids, ""]);
                setAmounts([...amounts, ""])    
            }}>
                <Plus size={25}/>
            </Button>
            { count === 1 ? 
                <></> : 
                <Button variant="danger" onClick={() => {
                    setCount(count - 1);
                    ids.pop(); 
                    amounts.pop();
                    setIds(ids);
                    setAmounts(amounts);
                }}>
                    <Dash size={25}/>
                </Button>
            }
        </ButtonGroup>
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
                <Card.Header>{ blockNo === "" ? <>Minting...</> : <>Minted</> }</Card.Header>
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

    const mintInfo = (
        <Card bg="secondary" text="white" style={{ width: '42rem' }}>
            <Card.Body><i>
                The Forgeum tokens with IDs of 0, 1, and 2 are free to mint, except for the gas costs.<br/>
                Specify how many of which token you would like to mint, below.<br/>
                Using the plus button you can add different tokens to mint as a batch.<br/>
                There is a cooldown of 1 minutes between mints.<br/>
                To earn tokens with ID higher than 2, you need to forge the tokens that you minted.
            </i></Card.Body>
        </Card>
    );

    const inputPair = (i) => (
        <Row>
            <Col sm={4}>
                <InputGroup className="mb-3" size="lg">
                    <Form.Control
                        type="number"
                        placeholder="Amount"
                        value={ amounts[i] }
                        onChange={(e) =>  { 
                            let newAmounts = [...amounts];
                            newAmounts[i] = e.target.value;
                            setAmounts(newAmounts);
                        }}
                    />
                    <InputGroup.Text id="basic-addon1"><X size={25}/></InputGroup.Text>
                </InputGroup>
            </Col>
            <Col sm={5}>
                <InputGroup className="mb-3" size="lg">
                    <InputGroup.Text id="basic-addon1">ID : </InputGroup.Text>
                    <Form.Control
                        type="number"
                        placeholder="Token Id"
                        value={ ids[i] }
                        onChange={(e) =>  { 
                            let newIds = [...ids];
                            newIds[i] = e.target.value;
                            setIds(newIds);
                        }}
                    />
                </InputGroup>
            </Col>
        </Row>
    );

    return (
        <div>
            <h1>Mint Tokens</h1><br/>
            { mintInfo }
            <br/>{ errorMessage }<br/><br/>
            <Row>
                <Col className="align-items-center">
                    { Array(count).fill(null).map((value, index) => <div key={index}>{inputPair(index)}</div>) }
                    { mintButton }
                </Col>
                <Col>
                { adjustButton }
                </Col>    
            </Row>
            <br/>
            { txInfo }
        </div>
    );
}

export default Mint;