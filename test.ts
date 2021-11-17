import {Connection} from "@solana/web3.js";


const settings = {
    commitment: "recent",
    cacheFunctions: {
        names: ["getProgramAccounts"],
        params: {
            getProgramAccounts: [
                "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
                "vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn",
                "auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8",
                "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98"
            ],
        },
        filters: {
            getProgramAccounts: {
                "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98": [
                    [
                        {
                            dataSize: 388,
                        },
                    ],
                ],
            },
        },
    },
};

const connection = new Connection(
    "https://solana-api.projectserum.com/",
    "recent"
);

// const programID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
const programID = "EidNXXqQS3xf51utL4UFWoyEE2ZUFcdL683cZnpBGqjJ"

const x = async (): Promise<void> => {
    console.log("hello")
    const resp = await (connection as any)._rpcRequest("getProgramAccounts", [
        programID,
        // {commitment: settings.commitment, encoding: "base64"},
        {commitment: settings.commitment, encoding: "base64", filters: []},
    ]);
    console.log("filter")
    console.log("connection")
    console.log(connection)
    console.log("programID")
    console.log(programID)
    console.log("resp")
    console.log(resp)
    console.log("resp.result")
    console.log(resp.result)
}

x()


