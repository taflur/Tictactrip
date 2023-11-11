import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

// Define your API documentation options
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'Tictactrip Text Justification',
            description: 'Implementation of Text Justification with TypeScript',
        },
        servers: [
            {
                url: 'http://localhost:4001',
                description: '',
            },
        ],
        components: {
            securitySchemes: {
                apiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                },
            },
        },
        security: [
            {
                apiKeyAuth: [],
            },
        ],
    },
    // Specify the API files containing JSDoc comments
    apis: ['./src/index.ts'],
};

// Generate the OpenAPI specification
const swaggerSpec = swaggerJsdoc(options);

// Write the specification to a file
const outputFile = './swagger_output.json';
fs.writeFileSync(outputFile, JSON.stringify(swaggerSpec, null, 2));

console.log(`Swagger specification generated and saved to ${outputFile}`);
