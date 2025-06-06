const pacienteService = require('../services/pacienteService');

const resolvers = {
    Query: {
        // Obtener todos los pacientes
        getPacientes: async () => {
            return await pacienteService.getAllPacientes();
        },

        // Obtener paciente por ID
        getPacienteById: async (_, { id }) => {
            return await pacienteService.getPacienteById(id);
        },

        // Obtener paciente por nivel educativo
        getPacienteByNivelEducativo: async (_, { nivel }) => {
            return await pacienteService.getPacientesByNivelEducativo(nivel);
        },
        
        // Obtener paciente por email
        getPacienteByEmail: async (_, { email }) => {
            return await pacienteService.getPacienteByEmail(email);
        },

        // Buscar pacientes con filtros
        searchPacientes: async (_, { filtros, limite, pagina }) => {
            return await pacienteService.searchPacientes(filtros, limite, pagina);
        },

        // Contar pacientes
        countPacientes: async () => {
            return await pacienteService.countPacientes();
        },

        // Obtener pacientes por profesión
        getPacientesByProfesion: async (_, { profesion }) => {
            return await pacienteService.getPacientesByProfesion(profesion);
        },

        // Obtener pacientes por nivel educativo
        getPacientesByNivelEducativo: async (_, { nivel }) => {
            return await pacienteService.getPacientesByNivelEducativo(nivel);
        },

        // Obtener estadísticas
        getEstadisticasPacientes: async () => {
            return await pacienteService.getEstadisticasPacientes();
        },

        // Obtener pacientes con experiencia mínima
        getPacientesConExperiencia: async (_, { experienciaMinima }) => {
            return await pacienteService.getPacientesConExperiencia(experienciaMinima);
        },

        // Obtener pacientes por idioma
        getPacientesPorIdioma: async (_, { idioma }) => {
            return await pacienteService.getPacientesPorIdioma(idioma);
        }
    },

    Mutation: {
        // Crear nuevo paciente
        createPaciente: async (_, { input }) => {
            return await pacienteService.createPaciente(input);
        },

        // Actualizar paciente
        updatePaciente: async (_, { id, input }) => {
            return await pacienteService.updatePaciente(id, input);
        },

        // Eliminar paciente
        deletePaciente: async (_, { id }) => {
            return await pacienteService.deletePaciente(id);
        },

        // Agregar habilidad
        addHabilidad: async (_, { id, habilidad }) => {
            return await pacienteService.addHabilidad(id, habilidad);
        },

        // Remover habilidad
        removeHabilidad: async (_, { id, habilidad }) => {
            return await pacienteService.removeHabilidad(id, habilidad);
        },

        // Agregar idioma
        addIdioma: async (_, { id, idioma }) => {
            return await pacienteService.addIdioma(id, idioma);
        },

        // Remover idioma
        removeIdioma: async (_, { id, idioma }) => {
            return await pacienteService.removeIdioma(id, idioma);
        },

        // Actualizar nivel de idioma
        updateNivelIdioma: async (_, { id, idioma, nuevoNivel }) => {
            return await pacienteService.updateNivelIdioma(id, idioma, nuevoNivel);
        }
    },

    // Resolvers para tipos personalizados
    Paciente: {
        // Convertir ObjectId a string para el campo id
        id: (parent) => parent._id.toString(),
        
        // Formatear fechas
        createdAt: (parent) => parent.createdAt ? parent.createdAt.toISOString() : null,
        updatedAt: (parent) => parent.updatedAt ? parent.updatedAt.toISOString() : null,
        
        // Transformar nivel educativo de base de datos a GraphQL enum
        nivelEducativo: (parent) => {
            const nivelMap = {
                'Primaria': 'PRIMARIA',
                'Secundaria': 'SECUNDARIA',
                'Técnico': 'TECNICO',
                'Tecnológico': 'TECNOLOGICO',
                'Universitario': 'UNIVERSITARIO',
                'Posgrado': 'POSGRADO',
                'Maestría': 'MAESTRIA',
                'Doctorado': 'DOCTORADO'
            };
            return nivelMap[parent.nivelEducativo] || parent.nivelEducativo;
        }
    },

    // Resolver para idiomas
    Idioma: {
        // Transformar nivel de idioma de base de datos a GraphQL enum
        nivel: (parent) => {
            const nivelMap = {
                'Básico': 'BASICO',
                'Intermedio': 'INTERMEDIO',
                'Avanzado': 'AVANZADO',
                'Nativo': 'NATIVO'
            };
            return nivelMap[parent.nivel] || parent.nivel;
        }
    }
};

module.exports = resolvers;