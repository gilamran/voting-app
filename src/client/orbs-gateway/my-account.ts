import * as Orbs from 'orbs-client-sdk/dist/index.es.js';
import { Account } from 'orbs-client-sdk/dist/orbs/Account';
import { uint8ArrayToHexString, hexStringToUint8Array } from './utils';

const { createAccount } = Orbs;

function serializeAccount(account: Account): string {
  return JSON.stringify(
    {
      ClientPublicKey: uint8ArrayToHexString(account.publicKey),
      ClientPrivateKey: uint8ArrayToHexString(account.privateKey),
      ClientAddress: account.address,
    },
    null,
    2,
  );
}

function deserializeAccount(str: string): Account {
  const asJson = JSON.parse(str);
  return {
    publicKey: hexStringToUint8Array(asJson.ClientPublicKey),
    privateKey: hexStringToUint8Array(asJson.ClientPrivateKey),
    address: asJson.ClientAddress,
  };
}

function generateMyAccount(): Account {
  const myNewAccount = createAccount();
  localStorage.setItem('my-orbs-account', serializeAccount(myNewAccount));
  return getMyAccount();
}

export function getMyAccount(): Account {
  const asStr = localStorage.getItem('my-orbs-account');
  return asStr ? deserializeAccount(asStr) : generateMyAccount();
}
