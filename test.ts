import {
    AccountInfo,
    Commitment,
    Connection,
    ConnectionConfig,
    GetProgramAccountsConfig,
    PublicKey
} from "@solana/web3.js";
import {Buffer} from "buffer";

//
// const settings = {
//     commitment: "recent",
//     cacheFunctions: {
//         names: ["getProgramAccounts"],
//         params: {
//             getProgramAccounts: [
//                 // "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
//                 "vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn",
//                 // "auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8",
//                 // "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98"
//             ],
//         },
//         filters: {
//             getProgramAccounts: {
//                 "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98": [
//                     [
//                         {
//                             dataSize: 388,
//                         },
//                     ],
//                 ],
//             },
//         },
//     },
// };
//
// const connection = new Connection(
//     "https://solana-api.projectserum.com/",
//     {
//         "commitment": "recent"
//     }
// );

// const programID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"

// const programID ="vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn"
// const programID = "auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8"
// const programID = "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98"

// const programID = "EidNXXqQS3xf51utL4UFWoyEE2ZUFcdL683cZnpBGqjJ"


// const x = async (): Promise<void> => {
//     console.log("hello")
//     const resp = await (connection as any)._rpcRequest("getProgramAccounts", [
//         programID,
//         // {commitment: settings.commitment, encoding: "base64"},
//         {commitment: "recent", encoding: "base64", filters: []},
//     ]);
//     console.log("filter")
//     console.log("connection")
//     console.log(connection)
//     console.log("programID")
//     console.log(programID)
//     console.log("resp")
//     console.log(resp)
//     console.log("resp.result")
//     console.log(resp.result)
// }
//
// x()

//
// const  a =  {
//     "confirmTransactionInitialTimeout": 1,
//     "commitment": "recent"
// }


const connection = new Connection(
    "https://solana-api.projectserum.com/",
    {
        "commitment": "recent"
    }
);

// const programID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
// const programID ="vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn"
// const programID = "auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8"
const programID = "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98"
// const programID = "EidNXXqQS3xf51utL4UFWoyEE2ZUFcdL683cZnpBGqjJ"

connection.getProgramAccounts(
    new PublicKey(programID),
    // "recent",
).then(r => console.log(r))






