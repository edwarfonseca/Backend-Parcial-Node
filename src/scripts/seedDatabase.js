// src/scripts/seedDatabase.js
const mongoose = require('mongoose');
require('dotenv').config();
const Paciente = require('../models/Paciente');

// Datos de ejemplo para poblar la base de datos
const pacientesEjemplo = [
    {
        nombre: "María García López",
        edad: 28,
        telefono: "+57-300-111-2222",
        email: "maria.garcia@email.com",
        nivelEducativo: "Universitario",
        profesion: "Médica General",
        experienciaLaboral: 5,
        habilidades: ["Medicina General", "Urgencias", "Pediatría", "Comunicación"],
        idiomas: [
            { idioma: "Español", nivel: "Nativo" },
            { idioma: "Inglés", nivel: "Avanzado" },
            { idioma: "Portugués", nivel: "Intermedio" }
        ]
    },
    {
        nombre: "Carlos Rodríguez Martínez",
        edad: 35,
        telefono: "+57-310-333-4444",
        email: "carlos.rodriguez@email.com",
        nivelEducativo: "Universitario",
        profesion: "Ingeniero de Software",
        experienciaLaboral: 12,
        habilidades: ["JavaScript", "Python", "React", "Node.js", "MongoDB", "AWS", "Docker"],
        idiomas: [
            { idioma: "Español", nivel: "Nativo" },
            { idioma: "Inglés", nivel: "Avanzado" }
        ]
    },
    {
        nombre: "Ana Isabel Fernández",
        edad: 42,
        telefono: "+57-320-555-6666",
        email: "ana.fernandez@email.com",
        nivelEducativo: "Maestría",
        profesion: "Psicóloga Clínica",
        experienciaLaboral: 18,
        habilidades: ["Terapia Cognitivo-Conductual", "Psicología Infantil", "Evaluación Psicológica", "Mindfulness"],
        idiomas: [
            { idioma: "Español", nivel: "Nativo" },
            { idioma: "Inglés", nivel: "Intermedio" },
            { idioma: "Francés", nivel: "Básico" }
        ]
    },
    {
        nombre: "Luis Fernando Gómez",
        edad: 26,
        telefono: "+57-300-777-8888",
        email: "luis.gomez@email.com",
        nivelEducativo: "Técnico",
        profesion: "Técnico en Sistemas",
        experienciaLaboral: 3,
        habilidades: ["Soporte Técnico", "Redes", "Hardware", "Windows", "Linux"],
        idiomas: [
            { idioma: "Español", nivel: "Nativo" },
            { idioma: "Inglés", nivel: "Básico" }
        ]
    },
    {
        nombre: "Patricia Morales Ruiz",
        edad: 31,
        telefono: "+57-315-999-0000",
        email: "patricia.morales@email.com",
        nivelEducativo: "Universitario",
        profesion: "Contadora Pública",
        experienciaLaboral: 8,
        habilidades: ["Contabilidad", "Auditoría", "Excel Avanzado", "SAP", "Análisis Financiero"],
        idiomas: [
            { idioma: "Español", nivel: "Nativo" },
            { idioma: "Inglés", nivel: "Intermedio" }
        ]
    },
    {
        nombre: "Diego Alejandro Silva",
        edad: 29,
        telefono: "+57-301-111-3333",
        email: "diego.silva@email.com",
        nivelEducativo: "Universitario",
        profesion: "Diseñador Gráfico",
        experienciaLaboral: 6,
        habilidades: ["Adobe Photoshop", "Illustrator", "InDesign", "UI/UX Design", "Marketing Digital"],
        idiomas: [
            { idioma: "Español", nivel: "Nativo" },
            { idioma: "Inglés", nivel: "Avanzado" },
            { idioma: "Italiano", nivel: "Básico" }
        ]
    },
    {
        nombre: "Carmen Elena Torres",
        edad: 45,
        telefono: "+57-312-444-5555",
        email: "carmen.torres@email.com",
        nivelEducativo: "Posgrado",
        profesion: "Arquitecta",
        experienciaLaboral: 20,
        habilidades: ["AutoCAD", "Revit", "SketchUp", "Gestión de Proyectos", "Diseño Sostenible"],
        idiomas: [
            { idioma: "Español", nivel: "Nativo" },
            { idioma: "Inglés", nivel: "Avanzado" },
            { idioma: "Alemán", nivel: "Intermedio" }
        ]
    },
    {
        nombre: "Roberto Carlos Mendoza",
        edad: 33,
        telefono: "+57-318-666-7777",
        email: "roberto.mendoza@email.com",
        nivelEducativo: "Universitario",
        profesion: "Abogado",
        experienciaLaboral: 9,
        habilidades: ["Derecho Civil", "Derecho Laboral", "Litigios", "Mediación", "Contratos"],
        idiomas: [
            { idioma: "Español", nivel: "Nativo" },
            { idioma: "Inglés", nivel: "Intermedio" }
        ]
    },
    {
        nombre: "Isabella Vargas Castro",
        edad: 27,
        telefono: "+57-319-888-9999",
        email: "isabella.vargas@email.com",
        nivelEducativo: "Universitario",
        profesion: "Nutricionista",
        experienciaLaboral: 4,
        habilidades: ["Nutrición Clínica", "Planes Alimentarios", "Nutrición Deportiva", "Educación Nutricional"],
        idiomas: [
            { idioma: "Español", nivel: "Nativo" },
            { idioma: "Inglés", nivel: "Intermedio" },
            { idioma: "Francés", nivel: "Básico" }
        ]
    },
    {
        nombre: "Andrés Felipe Herrera",
        edad: 38,
        telefono: "+57-300-000-1111",
        email: "andres.herrera@email.com",
        nivelEducativo: "Maestría",
        profesion: "Profesor de Matemáticas",
        experienciaLaboral: 15,
        habilidades: ["Matemáticas", "Estadística", "Educación", "Tecnología Educativa", "Investigación"],
        idiomas: [
            { idioma: "Español", nivel: "Nativo" },
            { idioma: "Inglés", nivel: "Avanzado" }
        ]
    }
];

async function seedDatabase() {
    try {
        // Conectar a la base de datos
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('🔗 Conectado a MongoDB');

        // Limpiar la colección existente
        await Paciente.deleteMany({});
        console.log('🗑️  Base de datos limpia');

        // Insertar datos de ejemplo
        const pacientesCreados = await Paciente.insertMany(pacientesEjemplo);
        console.log(`✅ Se crearon ${pacientesCreados.length} pacientes de ejemplo`);

        // Mostrar algunos ejemplos
        console.log('\n📋 Ejemplos de pacientes creados:');
        pacientesCreados.slice(0, 3).forEach((paciente, index) => {
            console.log(`${index + 1}. ${paciente.nombre} - ${paciente.profesion} (${paciente.experienciaLaboral} años exp.)`);
        });

        console.log('\n🎉 Base de datos poblada exitosamente');
        console.log(`📊 Total de pacientes: ${pacientesCreados.length}`);

    } catch (error) {
        console.error('❌ Error poblando la base de datos:', error);
    } finally {
        // Cerrar conexión
        await mongoose.connection.close();
        console.log('🔌 Conexión cerrada');
        process.exit(0);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;