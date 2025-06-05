const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Paciente {
        id: ID!
        name: String!
        email: String!
        createdAt: String
        updatedAt: String
    }

    input PacienteInput {
        name: String!
        email: String!
    }

    type Query {
        getPacientes: [Paciente!]!
        getPacienteById(id: ID!): Paciente
        getPacienteByEmail(email: String!): Paciente
        countPacientes: Int!
    }

    type Mutation {
        createPaciente(input: PacienteInput!): Paciente!
        updatePaciente(id: ID!, input: PacienteInput!): Paciente!
        deletePaciente(id: ID!): Boolean!
    }
`;

module.exports = typeDefs;