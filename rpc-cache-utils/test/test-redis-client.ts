// import {
//     redisWriteClient,
// } from "../src/connection";
//
// // console.log(redisWriteClient)
//
// console.log(redisWriteClient.connected)
// // redisWriteClient.hset("D6Cp3psGSevXkoZCnNShKDxvK81wTPsDjAMvDGFe2Dtc", "value","a");


import redis from "redis";

const client = redis.createClient();

client.on("error", function (error: any) {
    console.error(error);
});
let i = 0
while (i < 10) {
    client.set("key", "555", redis.print);
    client.get("key", redis.print);
    i = i+1
}
console.log("exiting")