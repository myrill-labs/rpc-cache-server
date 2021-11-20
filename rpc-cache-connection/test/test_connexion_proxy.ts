import {
    PublicKey
} from "@solana/web3.js";
import {ConnectionProxy} from "../../rpc-cache-connection/src";
import util from "util";



(async () => {
    try {

        const list = await ConnectionProxy(
            "https://solana-api.projectserum.com/",
            // "bull_shit_url",
            "http://127.0.0.1:3000"
        )

        const programID = "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98"
        list.getProgramAccounts(
            new PublicKey(programID),
        ).then(r => console.log(`we retrieved ${r.length} entries`))

    } catch (e) {
        console.log(util.inspect(e, {showHidden: false, depth: null}));
    }
})();







