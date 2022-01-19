// Welcome to the Mass Key Deletion recipe.

// This tool allows you to
// 1. Delete all your functionCall Access Keys
// 2. Delete all but one specified Full Access Key
// 3. Delete all Full Access Keys and Lock an Account

/// STEP 1 Install near-api-js
// npm init (in directory where you stored this script)
// npm i near-api-js

const nearAPI = require("near-api-js"); // imports near api js

// Standard setup to connect to NEAR While using Node
const { keyStores, connect } = nearAPI;
const homedir = require("os").homedir();
const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = require("path").join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);
let config;

// STEP 2 Choose your configuration.
// set this variable to either "testnet" or "mainnet"
// if you haven't used this before use testnet to experiment so you don't lose real tokens by deleting all your access keys
const configSetting = "set your configuration here ";

// setting configuration based on input
switch (configSetting) {
  case "mainnet":
    config = {
      networkId: "mainnet",
      keyStore, // optional if not signing transactions
      nodeUrl: "https://rpc.mainnet.near.org",
      walletUrl: "https://wallet.near.org",
      helperUrl: "https://helper.mainnet.near.org",
      explorerUrl: "https://explorer.mainnet.near.org",
    };
    console.log("configuration set to mainnet ");

    break;

  case "testnet":
    config = {
      networkId: "testnet",
      keyStore, // optional if not signing transactions
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    console.log("configuration set to testnet ");
    break;
  default:
    console.log(`please choose a configuration `);
}

const deleteKeyTool = async () => {
  //Load Your Account
  const near = await connect(config);

  // STEP 4 enter your mainnet or testnet account name here!
  const account = await near.account("place your account name here!");

  // retrieve all access keys
  const allKeys = await account.getAccessKeys();

  // Step 5 (if you are specifying one full access key to delete)
  // This part has multiple steps to it. Some of the steps include setup of near cli and loggin in if you haven't done so before
  // These steps are recommended because this will be the easiest place for you to locate your full access key after all the others have been deleted
  // But you are free to specify any full access public key that you'd like

  // A. run `npm i near-cli` if you do not already have it
  // B. run `export NEAR_ENV=mainnet` or `export NEAR_ENV=testnet` in your terminal depending on where your account is
  // C. run `near login` to store a full access key onto your local machine in your ~/.near-credentials folder
  // D. navigate to your computer's root directory by running `cd ~` then run `ls -a` to see a list of all available folders including the hidden ones (./near-credentials is hidden)
  // E. open your `./near-credentials folder` and find the account name you want to run this script on
  // F. copy the public key and place it into this variable.

  let publicKeyToDelete = ""; // pub your public key here

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

  // STEP 6 Choose your deletion tool!
  // call one of these functions below there definition to use it

  // Deletes all functionCall access Keys
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

  // Deletes all of your full access keys
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

  // Deletes all but one specified Full Access Key
  const deleteAllButASpecifiedKey = (keyIDoNotWantToDelete) => {
    fullAccessKeyPublicKeys.forEach((publicKey, index) => {
      if (publicKey === keyIDoNotWantToDelete) {
        console.log(
          `not deleting ${
            keyIDoNotWantToDelete === publicKeyToDelete
          } from account`
        );
      } else {
        account.deleteKey(publicKey);
      }
    });
  };

  // STEP 6 continued.. uncomment the one you want to use
  // deleteFunctionCallKeys();
  // deleteFullAccessKeys()
  // deleteAllButASpecifiedKey(publicKeyToDelete);

  // STEP 7 Run the script
  // run `node mass-key-deletion-recipe.js
};

deleteKeyTool();
