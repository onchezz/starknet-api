const express = require('express');
const { Account, ec, json, stark, Provider, hash, CallData ,constants} = require('starknet')


// initialize Express app
const app = express();
const port = process.env.PORT || 3001;


// account creation endpoint
app.post('/accounts', async (req, res) => {

  try {
    // return account address
// connect provider
const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });

//new Argent X account v0.2.3
const argentXproxyClassHash = "0x25ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918";
const argentXaccountClassHash = "0x033434ad846cdd5f23eb73ff09fe6fddd568284a0fb7d1be20ee482f044dabe2";

// Generate public and private key pair.
const privateKey = stark.randomAddress();
const starkKeyPub = ec.starkCurve.getStarkKey(privateKey);

console.log('AX_ACCOUNT_PRIVATE_KEY=', privateKey);
console.log('AX_ACCOUNT_PUBLIC_KEY=', starkKeyPub);

// Calculate future address of the ArgentX account
const AXproxyConstructorCallData = CallData.compile({
    implementation: argentXaccountClassHash,
    selector: hash.getSelectorFromName("initialize"),
    calldata: CallData.compile({ signer: starkKeyPub, guardian: "0" }),
});
const AXcontractAddress = hash.calculateContractAddressFromHash(
  starkKeyPub,
    argentXproxyClassHash,
    AXproxyConstructorCallData,
    0
);
console.log('Precalculated account address=', AXcontractAddress);
    res.json({ address: AXcontractAddress, privakey: privateKey });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating account');
  }

});

// start server
app.listen(port, () => {
  console.log('API listening on port 3000');
});