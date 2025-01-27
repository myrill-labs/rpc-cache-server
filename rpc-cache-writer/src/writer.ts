import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { getProgramAccounts } from "./solana_utils/getProgramAccounts";
import { settings } from "../../rpc-cache-utils/src/config";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const callCorrespondingCachedMethod = async (
  name: string,
  param: any,
  filters: Array<any> | undefined,
  setWebSocket = false
): Promise<void> => {
  switch (name) {
    case "getProgramAccounts": {
      if (
        settings.cacheFunctions.params.getProgramAccounts.indexOf(param) >= 0
      ) {
        await getProgramAccounts(param, filters, setWebSocket);
      }
      break;
    }
    default:
      break;
  }
};

(async () => {
  for (const name of settings.cacheFunctions.names) {
    const params = (settings.cacheFunctions.params as Record<string, any>)[
      name
    ];
    const filterByName = (settings.cacheFunctions.filters as Record<any, any>)[
      name
    ];
    if (!params) {
      await callCorrespondingCachedMethod(name, undefined, undefined, true);
    } else {
      console.log(
        `Populating cache with method: ${name} for params: ${params}`
      );
      for (const mainParam of params) {
        let filters: Array<any> = [];
        if (filterByName) {
          filters = filterByName[mainParam];
        }
        await callCorrespondingCachedMethod(name, mainParam, filters, true);
      }
    }
  }
  console.log("Finished Populating cache");
})();

app.post("/", (req, res) => {
  // when this is called, it means a cache miss happened and the cache needs to be written to.
  // to do this, make an RPC call to the full node and write the value to cache.

  console.log("Writer server received POST request")
  console.log(`req.body:`)
  console.log(req.body)
  const { method, mainParam, filters } = req.body;
  const functionNames = settings.cacheFunctions.names;
  console.log(`Function names ${functionNames}`)
  console.log(`Method ${method}`)
  if (functionNames.indexOf(method) >= 0) {
    console.log(`Cache invalidation: ${method} - ${mainParam}`);
    (async () => {
      await callCorrespondingCachedMethod(method, mainParam, filters, true);
    })();
  }else{
    console.log(`Nothing happen since method="${method}" is not in function names="${functionNames}"`)
  }
  return res.sendStatus(200);
});

let port = process.env.WRITER_PORT
// let port = 3001

console.log(`Writer serving on port: ${port}`)
app.listen(port);
