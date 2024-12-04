const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid'); // Import UUID generator
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2)); // Log entire incoming event

    try {
        // Parse the incoming request body
        const body = JSON.parse(event.body);
        const { principalId, content } = body;

        // Validate the input
        if (!principalId || typeof content !== 'object') {
            console.error('Validation failed:', { principalId, content });
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Invalid input. "principalId" must be a number and "content" must be a JSON object.',
                }),
            };
        }

        // Prepare the new item
        const newItem = {
            TableName: process.env.TARGET_TABLE, // Use environment variable
            Item: {
                id: uuidv4(), // Generate UUID v4 for the ID
                principalId: Number(principalId), // Ensure principalId is a number
                createdAt: new Date().toISOString(), // Add createdAt field in ISO 8601 format
                body: content, // Store content as 'body'
            },
        };

        console.log('Writing item to DynamoDB:', newItem);

        // Store the item in DynamoDB
        await dynamoDB.put(newItem).promise();

        console.log('Successfully wrote item to DynamoDB.');

        // Return a success response
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Event stored successfully',
                item: newItem.Item,
            }),
        };
    } catch (error) {
        console.error('Error occurred while storing event:', error);

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
