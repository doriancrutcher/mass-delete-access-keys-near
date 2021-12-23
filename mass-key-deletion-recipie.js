// Step 1 Install near-api-js
// npm i near-api-js

// import near api js

const nearAPI = require("near-api-js");

///
// creates a keyStore that searches for keys in .near-credentials
// requires credentials stored locally by using a NEAR-CLI command: `near login`
// https://docs.near.org/docs/tools/near-cli#near-login

const { keyStores } = nearAPI;
const homedir = require("os").homedir();
const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = require("path").join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const { connect } = nearAPI;

const deleteKeyTool = async () => {
  const config = {
    networkId: "testnet",
    keyStore, // optional if not signing transactions
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };

  //Load Your Account
  const near = await connect(config);
  const account = await near.account("mikeyc.testnet");

  // retrieve all access keys
  const allKeys = await account.getAccessKeys();

  // Arrays to hold the public Keys for functionCall Keys and Full Access Keys
  const fullAccessKeyPublicKeys = [];

  const functionCallKeyPublicKeys = [];

  // Separate public keys of Full Access Keys and FunctionCall Keys
  allKeys.forEach(async (keyObject) => {
    if (keyObject.access_key.permission === "FullAccess") {
      fullAccessKeyPublicKeys.push(keyObject.public_key);
    } else {
      functionCallKeyPublicKeys.push(keyObject.public_key);
    }
  });

  const deleteFunctionCallKeys = () => {
    console.log(
      "here are your functionCall Access Key Public Keys:",
      functionCallKeyPublicKeys
    );
    functionCallKeyPublicKeys.forEach((publicKey) => {
      account.deleteKey(publicKey);
    });
    console.log(
      "They along with their private keys are now all gone:",
      functionCallKeyPublicKeys
    );
  };

  const deleteFullAccessKeys = () => {
    console.log(
      "here are your Full Access Key Public Keys:",
      fullAccessKeyPublicKeys
    );

    fullAccessKeyPublicKeys.forEach((publicKey) => {
      account.deleteKey(publicKey);
    });

    console.log(
      "They along with their private keys are now all gone:",
      fullAccessKeyPublicKeys
    );
  };

  const deleteAllButOneFullAccessKey = () => {
    fullAccessKeyPublicKeys.forEach((publicKey, index) => {
      if (index === 0) {
        console.log("saving one full access key pair ");
      } else {
        account.deleteKey(publicKey);
      }
    });
  };
};

deleteKeyTool();
