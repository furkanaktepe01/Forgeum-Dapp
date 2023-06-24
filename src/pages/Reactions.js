import { useContext } from 'react';
import { Container, Card, Col, Row, Table } from 'react-bootstrap';

import { EthersContext } from "../utils/EthersContext";
import { reactionFormula } from '../utils/Formulas';

const Reactions = () => {

    const { ruleEvents } = useContext(EthersContext);

    const table = (
        <Table striped bordered hover>
            <thead className="text-center">
                <tr>
                <th>No</th>
                <th>Id</th>
                <th>Reaction</th>
                </tr>
            </thead>
            <tbody className="text-center">{
                
                ruleEvents.length ?

                    ruleEvents.map((ruleEvent, i) => {

                        const { id } = ruleEvent;

                        return (
                            <tr key={i}>
                                <td>{ i+1 }</td>
                                <td>{id.slice(0,8)} ... {id.slice(-10)}</td>
                                <td>{ reactionFormula(ruleEvent) }</td>
                            </tr>
                        )
                    }) :
                    <></>
            }</tbody>
        </Table>
    );

    const reactionsInfo = (
        <Card bg="secondary" text="white" style={{ width: '40rem' }}>
            <Card.Body><i>
                Reactions specify how do tokens forge to create new ones.<br/>
                The notation of <b>c{"\u00D7"}[ X ]</b> signifies ID-<b>X</b> tokens of amount <b>c</b>.
            </i></Card.Body>
        </Card>
    );

    return (
        <div>
            <h1>Reactions</h1>
            <br/>
            { reactionsInfo }
            <br/><br/>
            <Container>
                <Row>
                    <Col xs={8}>
                        { table }
                    </Col>
                </Row>
            </Container>
            
        </div>
    );
}

export default Reactions;