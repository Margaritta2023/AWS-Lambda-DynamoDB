const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid'); // Import UUID generator
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        // Parse the incoming request body
        const body = JSON.parse(event.body);
        const { principalId, content } = body;

        // Validate the input
        if (!principalId || typeof content !== 'object') {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Invalid input. "principalId" must be a number and "content" must be a JSON object.',
                }),
            };
        }

        // Prepare the new item
        const newItem = {
            TableName: process.env.TARGET_TABLE, // Environment variable for table name
            Item: {
                id: uuidv4(), // Generate UUID v4 for the ID
                principalId,
                createdAt: new Date().toISOString(), // Add createdAt field
                body: content, // Store content as 'body'
            },
        };

        // Store the item in DynamoDB
        await dynamoDB.put(newItem).promise();

        // Return a success response
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Event stored successfully',
                item: newItem.Item,
            }),
        };
    } catch (error) {
        console.error('Error:', error);
        // Return an error response
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error storing event',
                error: error.message,
            }),
        };
    }
};
