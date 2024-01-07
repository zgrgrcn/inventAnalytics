export default {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Invent_Analytics_Backend_Developer_Case',
            version: '1.0.0',
            description: 'Bir kütüphane için, üyeleri ve kitapların üyeler tarafından ödünç alınması işlemlerini yönetebilmek için bir uygulama geliştirilecektir',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};
