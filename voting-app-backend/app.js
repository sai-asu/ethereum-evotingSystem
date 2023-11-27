const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const ccpPath = path.resolve(__dirname, 'connection.json'); // Path to the connection profile

async function main() {
    try {
        // Setup Wallet
        const wallet = new FileSystemWallet('./wallet');

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: false } });

        // Get the network (channel)
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('mychaincode');

        // Submit the specified transaction.
        // registerVoter transaction

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

let voters = [];
let votes = [];
let candidates = [];

// API to register voters
app.post('/register', (req, res) => {
    const { voterId, name } = req.body;
    if (voters.find(v => v.voterId === voterId)) {
        return res.status(400).send('Voter already registered.');
    }
    voters.push({ voterId, name });
    console.log("success")
    console.log(voters)
    res.send('Voter registered successfully.');
});

// API to add candidates
app.post('/addCandidate', (req, res) => {
    const { candidateId, candidateName } = req.body;
    if (candidates.find(c => c.candidateId === candidateId)) {
        return res.status(400).send('Candidate already added.');
    }
    candidates.push({ candidateId, candidateName });
    res.send('Candidate added successfully.');
});

// API to cast a vote
app.post('/vote', (req, res) => {
    const { voterId, candidateId } = req.body;
    console.log(req.body)
    if (!voters.find(v => v.voterId === voterId)) {
        return res.status(400).send('Voter not registered.');
    }
    if (votes.find(v => v.voterId === voterId)) {
        return res.status(400).send('Voter has already voted.');
    }
    if (!candidates.find(c => c.candidateId === candidateId)) {
        return res.status(400).send('Invalid candidate ID.');
    }
    votes.push({ voterId, candidateId });
    console.log(votes)
    res.send('Vote cast successfully.');
});

// API to get candidate names
app.get('/candidates', (req, res) => {
    res.json(candidates);
});

// API to get results
app.get('/results', (req, res) => {
    const voteCounts = votes.reduce((acc, vote) => {
        acc[vote.candidateId] = (acc[vote.candidateId] || 0) + 1;
        return acc;
    }, {});

    const results = candidates.map(candidate => ({
        candidateId: candidate.candidateId,
        candidateName: candidate.candidateName,
        votes: voteCounts[candidate.candidateId] || 0
    }));

    res.json(results);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
