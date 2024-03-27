import {
  SuiObjectChangeCreated,
  SuiObjectResponse,
  SuiTransactionBlockResponse,
} from '@mysten/sui.js/client';
import { normalizeSuiAddress, SUI_TYPE_ARG } from '@mysten/sui.js/utils';
import BigNumber from 'bignumber.js';
import { pathOr, prop } from 'ramda';

import { isSameAddress, signAndExecute } from '@/utils';
import {
  CreatedCoinInfo,
  SendAirdropArgs,
} from '@/views/airdrop/airdrop.types';

export const findNextVersionAndDigest = (
  tx: SuiTransactionBlockResponse,
  id: string
) => {
  let nextDigest = '';
  let nextVersion = '';
  tx.objectChanges!.forEach((objectChanged: any) => {
    const objectId = prop('objectId', objectChanged);
    if (objectId === id) {
      nextDigest = prop('digest', objectChanged);
      nextVersion = prop('version', objectChanged);
    }
  });

  return [nextDigest, nextVersion];
};

export const sendAirdrop = async ({
  suiClient,
  txb,
  contractPackageId,
  tokenType,
  coinToSend,
  batch,
  currentAccount,
  signTransactionBlock,
}: SendAirdropArgs) => {
  txb.moveCall({
    target: `${contractPackageId}::airdrop::send`,
    typeArguments: [tokenType],
    arguments: [
      coinToSend,
      txb.pure(batch.map((x) => normalizeSuiAddress(x.address))),
      txb.pure(
        batch.map((x) => BigNumber(x.amount).decimalPlaces(0).toString())
      ),
    ],
  });

  return signAndExecute({
    suiClient,
    txb,
    currentAccount,
    signTransactionBlock,
    options: {
      showObjectChanges: true,
    },
  });
};

export const suiObjectIdsReducer =
  (address: string) =>
  (
    acc: ReadonlyArray<string>,
    object: SuiObjectChangeCreated
  ): ReadonlyArray<string> => {
    if (!object.objectType.includes(SUI_TYPE_ARG)) return acc;

    if (!isSameAddress(pathOr('', ['owner', 'AddressOwner'], object), address))
      return acc;

    return [...acc, object.objectId];
  };

export const getCreatedCoinInfo = (
  object: SuiObjectResponse
): CreatedCoinInfo => ({
  objectId: pathOr('', ['data', 'objectId'], object),
  version: pathOr('', ['data', 'version'], object),
  digest: pathOr('', ['data', 'digest'], object),
});
