const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
 
// Initialize DynamoDB DocumentClient
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = "Events"; // Replace with your DynamoDB table name
 
exports.handler = async (event) => {
    try {
        // Parse the incoming request body
        const body = JSON.parse(event.body);
 
        // Validate required fields
if (!body.name || !body.details) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing required fields: name, details" }),
            };
        }
 
        // Generate a unique event ID and timestamp
        const eventId = uuidv4();
        const timestamp = new Date().toISOString();
 
        // Create the event item to insert into DynamoDB
        const item = {
            eventId,
name: body.name,
            details: body.details,
            createdAt: timestamp,
        };
 
        // Save the item to the DynamoDB table
        await dynamoDb.put({
            TableName: tableName,
            Item: item,
        }).promise();
 
        // Return the created event as the response
        return {
            statusCode: 201,
            body: JSON.stringify(item),
        };
    } catch (error) {
        console.error("Error saving event:", error);
 
        // Return an error response
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Could not save event", error: error.message }),
        };
    }
};