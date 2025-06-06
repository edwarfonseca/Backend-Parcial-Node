const { gql } = require('apollo-server-express');

const typeDefs = gql`
    # Enum para nivel educativo
    enum NivelEducativo {
        PRIMARIA
        SECUNDARIA
        TECNICO
        TECNOLOGICO
        UNIVERSITARIO
        POSGRADO
        MAESTRIA
        DOCTORADO
    }

    # Enum para nivel de idioma
    enum NivelIdioma {
        BASICO
        INTERMEDIO
        AVANZADO
        NATIVO
    }

    # Tipo para idiomas
    type Idioma {
        idioma: String!
        nivel: NivelIdioma!
    }

    # Input para idiomas
    input IdiomaInput {
        idioma: String!
        nivel: NivelIdioma!
    }

    # Tipo principal Persona
    type Persona {
        id: ID!
        nombre: String!             # Este es el campo correcto (no "name")
        edad: Int!
        telefono: String!
        email: String!
        nivelEducativo: NivelEducativo!
        profesion: String!
        experienciaLaboral: Int!
        habilidades: [String!]!
        idiomas: [Idioma!]!
        createdAt: String
        updatedAt: String
    }

    # Input para crear Persona
    input PersonaInput {
        nombre: String!
        edad: Int!
        telefono: String!
        email: String!
        nivelEducativo: NivelEducativo!
        profesion: String!
        experienciaLaboral: Int!
        habilidades: [String!]
        idiomas: [IdiomaInput!]
    }

    # Input para actualizar Persona (todos los campos opcionales excepto al menos uno)
    input PersonaUpdateInput {
        nombre: String
        edad: Int
        telefono: String
        email: String
        nivelEducativo: NivelEducativo
        profesion: String
        experienciaLaboral: Int
        habilidades: [String!]
        idiomas: [IdiomaInput!]
    }

    # Tipo para filtros de búsqueda
    input PersonaFilterInput {
        nombre: String
        profesion: String
        nivelEducativo: NivelEducativo
        experienciaMinima: Int
        experienciaMaxima: Int
        edadMinima: Int
        edadMaxima: Int
        habilidad: String
        idioma: String
    }

    # Tipo para estadísticas
    type EstadisticasPersonas {
        total: Int!
        promedioEdad: Float
        promedioExperiencia: Float
        profesionMasComun: String
        nivelEducativoMasComun: String
        idiomaMasComun: String
    }

    type Query {
        # Obtener todos los Personas
        getPersonas: [Persona!]!
        
        # Obtener Persona por ID
        getPersonaById(id: ID!): Persona

        # Obtener Persona por nivel educativo
        getPersonaByNivelEducativo(nivel: NivelEducativo!): [Persona!]!

        # Obtener Persona por email
        getPersonaByEmail(email: String!): Persona
        
        # Buscar Personas con filtros
        searchPersonas(filtros: PersonaFilterInput, limite: Int = 10, pagina: Int = 1): [Persona!]!
        
        # Contar Personas
        countPersonas: Int!
        
        # Obtener Personas por profesión
        getPersonasByProfesion(profesion: String!): [Persona!]!
        
        # Obtener Personas por nivel educativo
        getPersonasByNivelEducativo(nivel: NivelEducativo!): [Persona!]!
        
        # Obtener estadísticas generales
        getEstadisticasPersonas: EstadisticasPersonas!
        
        # Obtener Personas con experiencia mínima
        getPersonasConExperiencia(experienciaMinima: Int!): [Persona!]!
        
        # Obtener Personas que hablan un idioma específico
        getPersonasPorIdioma(idioma: String!): [Persona!]!
    }

    type Mutation {
        # Crear nuevo Persona
        createPersona(input: PersonaInput!): Persona!
        
        # Actualizar Persona existente
        updatePersona(id: ID!, input: PersonaUpdateInput!): Persona!
        
        # Eliminar Persona
        deletePersona(id: ID!): Boolean!
        
        # Agregar habilidad a un Persona
        addHabilidad(id: ID!, habilidad: String!): Persona!
        
        # Remover habilidad de un Persona
        removeHabilidad(id: ID!, habilidad: String!): Persona!
        
        # Agregar idioma a un Persona
        addIdioma(id: ID!, idioma: IdiomaInput!): Persona!
        
        # Remover idioma de un Persona
        removeIdioma(id: ID!, idioma: String!): Persona!
        
        # Actualizar nivel de idioma
        updateNivelIdioma(id: ID!, idioma: String!, nuevoNivel: NivelIdioma!): Persona!
    }
`;

module.exports = typeDefs;
