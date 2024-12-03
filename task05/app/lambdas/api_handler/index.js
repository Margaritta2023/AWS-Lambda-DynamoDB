const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { principalId, content } = body;

        const newItem = {
            TableName: process.env.TARGET_TABLE, // use environment variable
            Item: {
                id: new Date().toISOString(),
                principalId,
                content,
            },
        };

        await dynamoDB.put(newItem).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Event stored successfully', item: newItem.Item }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error storing event', error: error.message }),
        };
    }
};
