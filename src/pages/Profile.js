import { ethers } from "ethers";
import { useContext, useEffect, useState } from 'react';
import { X } from 'react-bootstrap-icons';
import { Col, Row, Table, Card, ListGroup, Container, Button, Spinner } from 'react-bootstrap';

import { EthersContext } from "../utils/EthersContext";
import { checkNetwork, checkWalletNetwork, getNewBrowserProvider } from "../utils/Wallet";

const Profile = () => {  

    const { isConnected, signer, contracts: { token } } = useContext(EthersContext);

    const [balance, setBalance] = useState("");
    const [nonce, setNonce] = useState("");
    const [tokenBalances, setTokenBalances] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        
        (async () => {

            if(!isConnected) {
                setError("unconnected");
                return;
            }

            if (! await checkNetwork()) {
                setError("different-network");
                return;
            }

            const provider = getNewBrowserProvider();

            const balance = await provider.getBalance(signer.address);
            const nonce = await provider.getTransactionCount(signer.address);
        
            setError("");
            setBalance(ethers.formatEther(balance));  
            setNonce(nonce);
            setTokenBalances(await getTokenBalances(provider, signer.address));
        })();

    }, [signer]);

    const getTokenBalances = async (provider, address) => {

        const possessedTokens = await fetchPossessedTokens(provider, address);

        let tokenBalances_ = [];

        for (let i = 0; i < possessedTokens.length; i++) {

            const tokenId = possessedTokens[i]; 

            const balance = await token.balanceOf(address, tokenId);    // dont add if 0 balance, maybe: if then continue

            tokenBalances_[i] = { tokenId, balance: parseInt(balance) };
        }

        return tokenBalances_;
    }

    const fetchPossessedTokens = async (provider, address) => {

        const transferSingleFilter = token.filters.TransferSingle(null, null, address, null, null);
        const transferBatchFilter = token.filters.TransferBatch(null, null, address, null, null);

        const transferSingleEvents = await token.queryFilter(transferSingleFilter);
        const transferBatchEvents = await token.queryFilter(transferBatchFilter);

        let tokenIds = transferSingleEvents.map((event_) => event_.args[3]);

        for (let i = 0; i < transferBatchEvents.length; i++) {

            tokenIds = [...tokenIds, ...transferBatchEvents[i].args[3]];
        }

        return [...new Set(tokenIds)].map((n) => parseInt(n)).sort((a, b) => a - b);
    }

    const accountInfo = (
        balance !== "" ?
            <Card bg="secondary" text="white" style={{ width: '35rem' }}>
                <Card.Header><h2>Account Info</h2></Card.Header>
                <ListGroup variant="flush">
                <ListGroup.Item><b>Address:</b> <i>{signer.address}</i></ListGroup.Item>
                <ListGroup.Item><b>Balance:</b> <i>{balance.slice(0, 6)}</i></ListGroup.Item>
                <ListGroup.Item><b>Nonce:</b> <i>{nonce}</i></ListGroup.Item>
                </ListGroup>
            </Card> :
            <></>
    );

    const errorMessage = (
        error !== "" ?
        <Card bg="secondary" text="white" style={{ width: '45rem' }}>
            <Card.Header><h3>{ 
                error === "unconnected" ?
                    <><br/>Connect with Metamask to see profile details.</> :
                    <><br/><Row>
                      <Col xs={10}>
                        Switch your network to see profile details.
                      </Col>
                      <Col>
                        <Button 
                            variant="dark" 
                            onClick={async () => {
                                await checkWalletNetwork();
                                window.location.reload();
                            }}
                        >
                            Switch
                        </Button>
                      </Col>
                    </Row></>
            }</h3></Card.Header>
        </Card> :
        <></>
    );

    const tokenBalancesInfo = (
        tokenBalances.length ?
            <Table striped bordered hover>
                <thead className="text-center">
                    <tr>
                    <th>Token ID</th>
                    <th>Balance</th>
                    </tr>
                </thead>
                <tbody className="text-center">{
                    tokenBalances.map((tokenBalance, i) => {

                        const { tokenId, balance } = tokenBalance;

                        return (
                            <tr key={i}>
                                <td><b>{tokenId}</b></td>
                                <td><i>{balance}</i></td>
                            </tr>
                        );
                    })
                }</tbody>
            </Table> :
            <Spinner animation="border" variant="dark" />
    );

    return (
        <div>
            <h1>Profile</h1> 
            <br/>
            { errorMessage }
            { accountInfo } 
            <br/><br/>
            <Container>
                <Row>
                    <Col xs={4}>
                        { tokenBalancesInfo }
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Profile;