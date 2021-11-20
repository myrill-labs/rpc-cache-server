import {
    PublicKey
} from "@solana/web3.js";
import {ConnectionProxy} from "../../rpc-cache-connection/src";
import util from "util";
import sizeof from 'object-sizeof';


(async () => {
    try {

        const list = await ConnectionProxy(
            "https://solana-api.projectserum.com/",
            // "http://127.0.0.1:3000"
            "http://3.70.8.178:3000"
            // "bull_shit_url"
        )

        const programID = "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98"
        list.getProgramAccounts(
            new PublicKey(programID),
        ).then(r => console.log(`we retrieved ${r.length} entries. Data size: ${sizeof(r)/1000000} mo`))

    } catch (e) {
        console.log(util.inspect(e, {showHidden: false, depth: null}));
    }
})();







