const express = require('express');
const { ec, stark, hash, Account, Provider,  constants,  CallData } = require('starknet')


// initialize Express app
const app = express();

// initialize Starknet provider 
const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });

// account creation endpoint
app.post('/accounts', async (req, res) => {

  try {
    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });

// new Open Zeppelin account v0.5.1
// Generate public and private key pair.
const privateKey = stark.randomAddress();
console.log('New OZ account:\nprivateKey=', privateKey);
const starkKeyPub = ec.starkCurve.getStarkKey(privateKey);
console.log('publicKey=', starkKeyPub);

const OZaccountClassHash = "0x2794ce20e5f2ff0d40e632cb53845b9f4e526ebd8471983f7dbd355b721d5a";
// Calculate future address of the account
const OZaccountConstructorCallData = CallData.compile({ publicKey: starkKeyPub });
const OZcontractAddress = hash.calculateContractAddressFromHash(
    starkKeyPub,
    OZaccountClassHash,
    OZaccountConstructorCallData,
    0
);

    // return account address

    res.json({ address: OZcontractAddress, privakey: privateKey });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating account');
  }

});

// start server
app.listen(300, () => {
  console.log('API listening on port 3000');
});