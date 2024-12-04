const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid'); 
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2)); 

    try {
        let body;

     
        if (event.body) {
            console.log('Triggered by API Gateway');
            body = JSON.parse(event.body);
        } else {

            console.log('Direct Invocation');
            body = event;
        }

        const { principalId, content } = body;

        if (!principalId || typeof content !== 'object') {
            console.error('Validation failed:', { principalId, content });
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Invalid input. "principalId" must be a number and "content" must be a JSON object.',
                }),
            };
        }

        
        const newItem = {
            TableName: process.env.TARGET_TABLE, 
            Item: {
                id: uuidv4(), 
                principalId: Number(principalId), 
                createdAt: new Date().toISOString(), 
                body: content, 
            },
        };

        console.log('Writing item to DynamoDB:', newItem);

      
        await dynamoDB.put(newItem).promise();

        console.log('Successfully wrote item to DynamoDB.');

     
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
