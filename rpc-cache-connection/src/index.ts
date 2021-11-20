import {Commitment, Connection} from "@solana/web3.js";
import {parse as urlParse, UrlWithStringQuery} from "url";
import {createRpcClient, createRpcRequest} from "./rpc-utils";
import fetch from "node-fetch";

const UNSUPPORTED_ENCODINGS = ["jsonParsed"];

const rpcRequestCreator = (
    url: UrlWithStringQuery,
    useHttps: boolean,
    rpcFallback: any
) => {
    const _rpcClient = createRpcClient(url.href, useHttps);
    const _rpcRequest = createRpcRequest(_rpcClient, rpcFallback);
    // const _rpcBatchRequest = createRpcBatchRequest(_rpcClient);
    return _rpcRequest;
};
/**
 * Establish a JSON RPC connection and returns a Connection object that
 * forwards the rpc method request to either solanaEndpoint or cacheEndpoint
 * depending on the settings configuration in the cacheEndpoint server
 *
 * @param solanaEndpoint URL to the fullnode JSON RPC endpoint
 * @param cacheEnpoint URL to the the cache reader
 * @param defaultCommitment optional default commitment level used in case there is any error connecting to cacheEndpoint
 * @return {<Promise<Connection>>}
 */
export const ConnectionProxy = async (
    solanaEndpoint: string,
    cacheEnpoint: string,
    defaultCommitment: Commitment = "confirmed"
): Promise<Connection> => {

    console.log(`solana endpoint: "${solanaEndpoint}" cache endpoint "${cacheEnpoint}" default commitment: "${defaultCommitment}"`)

    try {
        console.log("try")
        const settings = JSON.parse(
            await fetch(`${cacheEnpoint}/settings`).then((res) => res.json())
        );
        const originalConnection = new Connection(
            solanaEndpoint,
            settings.commitment as Commitment
        );
        // @ts-ignore
        const solanaRpcRequest = originalConnection._rpcRequest;

        const url = urlParse(cacheEnpoint);
        const useHttps = url.protocol === "https:";
        console.log(`Are we using HTTPS? ${useHttps}`)
        const proxyRpcCache = rpcRequestCreator(url, useHttps, solanaRpcRequest);

        const _rpcRequest = async (method: string, params: any) => {
            const mainParam = params[0];
            const filters = params[1];
            let useProxyCache = false;
            if (
                !(UNSUPPORTED_ENCODINGS.indexOf(filters?.enconding) >= 0) &&
                settings.cacheFunctions.names.indexOf(method) >= 0
            ) {
                const configParams: Array<any> = ((settings.cacheFunctions
                    .params as Record<string, any>) || {})[method];
                if (!configParams) {
                    useProxyCache = true;
                } else if (
                    Array.isArray(mainParam) &&
                    mainParam.every((param) => configParams.indexOf(param) >= 0)
                ) {
                    useProxyCache = true;
                } else if (configParams.indexOf(mainParam) >= 0) {
                    useProxyCache = true;
                }
            }

            if (useProxyCache) {
                console.log(`Everything went good (useProxyCache="${useProxyCache}"), we are using the cache endpoint: ${cacheEnpoint} `)
                return proxyRpcCache(method, params);
            }
            console.log("Something went wrong, we are using the solana endpoint ...")
            return solanaRpcRequest(method, params);
        };

        const connection: Connection = Object.assign(originalConnection, {
            _rpcRequest: _rpcRequest,
        });



        return connection;
    } catch (error) {
        console.log(`ERROR="${error}" cache endpoint="${cacheEnpoint}" switching to solana endpoint="${solanaEndpoint}"`)
        return new Connection(solanaEndpoint, defaultCommitment);
    }
};
