import {PublicKey} from "@solana/web3.js";
import {
    connection,
    redisWriteClient,
} from "../../../rpc-cache-utils/src/connection";
import {settings} from "../../../rpc-cache-utils/src/config";
import {ParsedKeyedAccountInfo} from "../../../rpc-cache-utils/src/utils";
import * as util from "util";
import sizeof from 'object-sizeof';

const webSocketsIds: Map<string, number> = new Map();

export const getProgramAccounts = async (
    programID: string,
    filters: Array<any> | undefined,
    setWebSocket = false
): Promise<void> => {
    // console.log("flag 0 getProgramAccounts")
    const lfilters = filters || [[]];
    for (const filter of lfilters) {
        // console.log("flag1")
        console.log(
            `Fetching: getProgramAccounts of ${programID} with filters: ${util.inspect(
                filter
            )}`
        );
        const resp = await (connection as any)._rpcRequest("getProgramAccounts", [
            programID,
            {commitment: settings.commitment, encoding: "base64", filters: filter},
        ]);
        console.log(`we got ${resp.result.length} results`)
        console.log(`Data size: ${sizeof(resp.result)/1000000} mo`)
        // console.log(resp)

        setRedisAccounts(resp.result, programID);
    }

    if (setWebSocket) {
        const prevSubId = webSocketsIds.get(programID);
        if (prevSubId) {
            console.log(
                `removing listener Websocket for: onProgramAccountChange of ${programID}`
            );
            await connection.removeProgramAccountChangeListener(prevSubId);
        }
        console.log(
            `Creating Websocket for: onProgramAccountChange of ${programID}`
        );
        const subId = connection.onProgramAccountChange(
            new PublicKey(programID),
            async (info) => {
                const pubkey = info.accountId.toBase58();
                const accountInfo: ParsedKeyedAccountInfo = {
                    pubkey: pubkey,
                    account: {
                        executable: info.accountInfo.executable,
                        lamports: info.accountInfo.lamports,
                        // @ts-ignore
                        // it actually has this attr, but the type doesn't have it
                        rentEpoch: info.accountInfo.rentEpoch,
                        owner: info.accountInfo.owner.toBase58(),
                        data: [info.accountInfo.data.toString(), "base64"],
                    },
                };
                redisWriteClient.hset(programID, pubkey, JSON.stringify(accountInfo));
            }
        );
        webSocketsIds.set(programID, subId);
    }
};

const setRedisAccounts = (
    accounts: Array<ParsedKeyedAccountInfo>,
    programID: string
) => {
    for (const acc of accounts) {
        const pubkey = acc.pubkey;
        const info = acc.account;
        const accountInfo = {
            pubkey: pubkey,
            account: {
                executable: info.executable,
                lamports: info.lamports,
                rentEpoch: info.rentEpoch,
                owner: info.owner,
                data: info.data,
            },
        };
        // console.log(`saving in cache ${pubkey} of hash ${programID}. Do HGET ${programID} ${pubkey} on redit-cli to check`)
        // redisWriteClient.hset(programID, pubkey, JSON.stringify(accountInfo));
        redisWriteClient.hset(programID, pubkey, JSON.stringify(accountInfo));
        // redisWriteClient.hget(programID,pubkey, redis.print);
    }
};
