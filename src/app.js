const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
require('dotenv').config();

// Importar configuraciones
const connectDB = require('./config/database');
const typeDefs = require('./schemas/schema');
const resolvers = require('./resolvers/personaResolvers');

async function startServer() {
    // Conectar a la base de datos
    await connectDB();

    const app = express();

    // Configurar CORS
    app.use(cors({
        origin: '*', // En producción, especifica los dominios permitidos
        credentials: true
    }));

    // Crear servidor Apollo
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
            return {};
        },
        introspection: true, // Habilita introspección para GraphQL Playground
        playground: true     // Habilita GraphQL Playground
    });

    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });

    // Ruta de salud
    app.get('/health', (req, res) => {
        res.json({ 
            status: 'OK', 
            timestamp: new Date().toISOString(),
            service: 'GraphQL API Node.js'
        });
    });

    const PORT = process.env.PORT || 4000;
    
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        console.log(`📊 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
        console.log(`🎮 GraphQL Playground: http://localhost:${PORT}${server.graphqlPath}`);
    });
}

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
    console.error('Error no manejado:', err);
    process.exit(1);
});

startServer().catch(error => {
    console.error('Error iniciando el servidor:', error);
    process.exit(1);
});