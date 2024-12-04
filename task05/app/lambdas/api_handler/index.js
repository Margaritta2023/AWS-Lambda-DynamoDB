const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment')

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const Table_Name = process.env.target_table

exports.handler = async (event,context) => {
    
    console.log('Received event:', JSON.stringify(event, null, 2));

    try {
        const {principalId,content} = event
    
        const freshId = uuid.v4();
        const freshTime = moment.utc().toISOString();
   
   
        const newItem = {
            TableName: Table_Name,
            Item: {
                id: freshId,
                principalId: principalId,
                createdAt: freshTime,
                body: content,
            },
        };

        await dynamoDB.put(item).promise();

        const newObject = {
            TableName: Table_Name,
            Item: {
                id: freshId,
                principalId: principalId,
                createdAt: freshTime,
                body: content,
            },
        }

        return {
            statusCode:201,
            body:JSON.stringify({event:newObject})
        };
        } catch (error) {
         console.log("Eror during request:", error)
         return {
            statusCode:500,
            body:JSON.stringify({error:"Server Error"})
         }
        }
       

    }

