const pacienteService = require('../services/pacienteService');

const resolvers = {
    Query: {
        getPacientes: async () => {
            return await pacienteService.getAllPacientes();
        },

        getPacienteById: async (_, { id }) => {
            return await pacienteService.getPacienteById(id);
        },

        getPacienteByEmail: async (_, { email }) => {
            return await pacienteService.getPacienteByEmail(email);
        },

        countPacientes: async () => {
            return await pacienteService.countPacientes();
        }
    },

    Mutation: {
        createPaciente: async (_, { input }) => {
            const { name, email } = input;
            return await pacienteService.createPaciente(name, email);
        },

        updatePaciente: async (_, { id, input }) => {
            const { name, email } = input;
            return await pacienteService.updatePaciente(id, name, email);
        },

        deletePaciente: async (_, { id }) => {
            return await pacienteService.deletePaciente(id);
        }
    }
};

module.exports = resolvers;