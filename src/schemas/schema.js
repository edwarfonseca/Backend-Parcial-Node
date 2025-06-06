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

    # Tipo principal Paciente
    type Paciente {
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

    # Input para crear paciente
    input PacienteInput {
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

    # Input para actualizar paciente (todos los campos opcionales excepto al menos uno)
    input PacienteUpdateInput {
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
    input PacienteFilterInput {
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
    type EstadisticasPacientes {
        total: Int!
        promedioEdad: Float
        promedioExperiencia: Float
        profesionMasComun: String
        nivelEducativoMasComun: String
        idiomaMasComun: String
    }

    type Query {
        # Obtener todos los pacientes
        getPacientes: [Paciente!]!
        
        # Obtener paciente por ID
        getPacienteById(id: ID!): Paciente

        # Obtener paciente por nivel educativo
        getPacienteByNivelEducativo(nivel: NivelEducativo!): [Paciente!]!

        # Obtener paciente por email
        getPacienteByEmail(email: String!): Paciente
        
        # Buscar pacientes con filtros
        searchPacientes(filtros: PacienteFilterInput, limite: Int = 10, pagina: Int = 1): [Paciente!]!
        
        # Contar pacientes
        countPacientes: Int!
        
        # Obtener pacientes por profesión
        getPacientesByProfesion(profesion: String!): [Paciente!]!
        
        # Obtener pacientes por nivel educativo
        getPacientesByNivelEducativo(nivel: NivelEducativo!): [Paciente!]!
        
        # Obtener estadísticas generales
        getEstadisticasPacientes: EstadisticasPacientes!
        
        # Obtener pacientes con experiencia mínima
        getPacientesConExperiencia(experienciaMinima: Int!): [Paciente!]!
        
        # Obtener pacientes que hablan un idioma específico
        getPacientesPorIdioma(idioma: String!): [Paciente!]!
    }

    type Mutation {
        # Crear nuevo paciente
        createPaciente(input: PacienteInput!): Paciente!
        
        # Actualizar paciente existente
        updatePaciente(id: ID!, input: PacienteUpdateInput!): Paciente!
        
        # Eliminar paciente
        deletePaciente(id: ID!): Boolean!
        
        # Agregar habilidad a un paciente
        addHabilidad(id: ID!, habilidad: String!): Paciente!
        
        # Remover habilidad de un paciente
        removeHabilidad(id: ID!, habilidad: String!): Paciente!
        
        # Agregar idioma a un paciente
        addIdioma(id: ID!, idioma: IdiomaInput!): Paciente!
        
        # Remover idioma de un paciente
        removeIdioma(id: ID!, idioma: String!): Paciente!
        
        # Actualizar nivel de idioma
        updateNivelIdioma(id: ID!, idioma: String!, nuevoNivel: NivelIdioma!): Paciente!
    }
`;

module.exports = typeDefs;
