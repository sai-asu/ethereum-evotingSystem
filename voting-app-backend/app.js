const express = require('express');
const { Gateway, Wallets, FileSystemWallet } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function connectToContract() {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('voting');

    return { contract, gateway };
}

app.post('/registerVoter', async (req, res) => {
    const { contract, gateway } = await connectToContract();
    try {
        await contract.submitTransaction('RegisterVoter', req.body.voterId, req.body.name);
        res.json({ message: 'Voter registered successfully' });
    } catch (error) {
        res.status(500).send(error.toString());
    } finally {
        gateway.disconnect();
    }
});

app.post('/vote', async (req, res) => {
    const { contract, gateway } = await connectToContract();
    try {
        await contract.submitTransaction('CastVote', req.body.voterId, req.body.candidateId);
        res.json({ message: 'Vote cast successfully' });
    } catch (error) {
        res.status(500).send(error.toString());
    } finally {
        gateway.disconnect();
    }
});

app.get('/results', async (req, res) => {
    const { contract, gateway } = await connectToContract();
    try {
        const result = await contract.evaluateTransaction('GetResults');
        res.json(JSON.parse(result.toString()));
    } catch (error) {
        res.status(500).send(error.toString());
    } finally {
        gateway.disconnect();
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
