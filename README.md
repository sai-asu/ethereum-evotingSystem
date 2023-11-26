# ethereum-evotingSystem


Steps to run project.


1. Install Docker and Go
2. Download the necessary binaries and Docker images.

    curl -sSL https://raw.githubusercontent.com/hyperledger/fabric/master/scripts/bootstrap.sh | bash -s
3. Clone the Hyperledger Fabric samples repository from GitHub.

    git clone https://github.com/hyperledger/fabric-samples
    
    run the following commands one by one
4. cd fabric-samples/test-network
5. ./network.sh down && ./network.sh up
6. ./network.sh createChannel
7. Run 'go mod vendor'
8. export PATH=${PWD}/../bin:${PWD}:$PATH
   export FABRIC_CFG_PATH=$PWD/../config/
9. peer lifecycle chaincode package supplyChain.tar.gz --path <path-to-code> --lang golang --label voterSystem
10. Take role of Org1      export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
11. peer lifecycle chaincode install voterSystem.tar.gz
12. export CORE_PEER_LOCALMSPID="Org2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    export CORE_PEER_ADDRESS=localhost:9051
13. peer lifecycle chaincode install voterSystem.tar.gz
14. export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
15. peer lifecycle chaincode queryinstalled
16. Copy the Package ID from the result in the previous command, and set the following variable equal to it:
    export CC_PACKAGE_ID=
17. export CORE_PEER_LOCALMSPID="Org2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    export CORE_PEER_ADDRESS=localhost:9051
18. peer lifecycle chaincode queryinstalled
19. Copy the Package ID from the result in the previous command, and set the following variable equal to it:
    export CC_PACKAGE_ID=
20. peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name voterSystem --version 1.0 --sequence 1 --tls true --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
21. now lets setup the nodeJs backend
    cd voting-app-backend
    npm init
    npm install express
    npm install fabric-network
    node app.js
22. now that backend is up
    cd frontend/blockchain and run the index.html file







