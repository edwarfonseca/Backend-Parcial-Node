const personaService = require('../services/personaService');

const resolvers = {
    Query: {
        // Obtener todos los Personas
        getPersonas: async () => {
            return await personaService.getAllPersonas();
        },

        // Obtener Persona por ID
        getPersonaById: async (_, { id }) => {
            return await personaService.getPersonaById(id);
        },

        // Obtener Persona por nivel educativo
        getPersonaByNivelEducativo: async (_, { nivel }) => {
            return await personaService.getPersonasByNivelEducativo(nivel);
        },
        
        // Obtener Persona por email
        getPersonaByEmail: async (_, { email }) => {
            return await personaService.getPersonaByEmail(email);
        },

        // Buscar Personas con filtros
        searchPersonas: async (_, { filtros, limite, pagina }) => {
            return await personaService.searchPersonas(filtros, limite, pagina);
        },

        // Contar Personas
        countPersonas: async () => {
            return await personaService.countPersonas();
        },

        // Obtener Personas por profesión
        getPersonasByProfesion: async (_, { profesion }) => {
            return await personaService.getPersonasByProfesion(profesion);
        },

        // Obtener Personas por nivel educativo
        getPersonasByNivelEducativo: async (_, { nivel }) => {
            return await personaService.getPersonasByNivelEducativo(nivel);
        },

        // Obtener estadísticas
        getEstadisticasPersonas: async () => {
            return await personaService.getEstadisticasPersonas();
        },

        // Obtener Personas con experiencia mínima
        getPersonasConExperiencia: async (_, { experienciaMinima }) => {
            return await personaService.getPersonasConExperiencia(experienciaMinima);
        },

        // Obtener Personas por idioma
        getPersonasPorIdioma: async (_, { idioma }) => {
            return await personaService.getPersonasPorIdioma(idioma);
        }
    },

    Mutation: {
        // Crear nuevo Persona
        createPersona: async (_, { input }) => {
            return await personaService.createPersona(input);
        },

        // Actualizar Persona
        updatePersona: async (_, { id, input }) => {
            return await personaService.updatePersona(id, input);
        },

        // Eliminar Persona
        deletePersona: async (_, { id }) => {
            return await personaService.deletePersona(id);
        },

        // Agregar habilidad
        addHabilidad: async (_, { id, habilidad }) => {
            return await personaService.addHabilidad(id, habilidad);
        },

        // Remover habilidad
        removeHabilidad: async (_, { id, habilidad }) => {
            return await personaService.removeHabilidad(id, habilidad);
        },

        // Agregar idioma
        addIdioma: async (_, { id, idioma }) => {
            return await personaService.addIdioma(id, idioma);
        },

        // Remover idioma
        removeIdioma: async (_, { id, idioma }) => {
            return await personaService.removeIdioma(id, idioma);
        },

        // Actualizar nivel de idioma
        updateNivelIdioma: async (_, { id, idioma, nuevoNivel }) => {
            return await personaService.updateNivelIdioma(id, idioma, nuevoNivel);
        }
    },

    // Resolvers para tipos personalizados
    Persona: {
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