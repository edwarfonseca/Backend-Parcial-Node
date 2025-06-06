const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    edad: {
        type: Number,
        required: [true, 'La edad es requerida'],
        min: [0, 'La edad no puede ser negativa'],
        max: [120, 'La edad no puede ser mayor a 120 años']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es requerido'],
        trim: true,
        validate: {
            validator: function(v) {
                return /^[\+]?[0-9\s\-\(\)]{7,15}$/.test(v);
            },
            message: 'El formato del teléfono no es válido'
        }
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'El formato del email no es válido'
        }
    },
    nivelEducativo: {
        type: String,
        required: [true, 'El nivel educativo es requerido'],
        enum: {
            values: ['Primaria', 'Secundaria', 'Técnico', 'Tecnológico', 'Universitario', 'Posgrado', 'Maestría', 'Doctorado'],
            message: 'El nivel educativo debe ser uno de los valores permitidos'
        }
    },
    profesion: {
        type: String,
        required: [true, 'La profesión es requerida'],
        trim: true,
        minlength: [2, 'La profesión debe tener al menos 2 caracteres'],
        maxlength: [100, 'La profesión no puede exceder 100 caracteres']
    },
    experienciaLaboral: {
        type: Number,
        required: [true, 'La experiencia laboral es requerida'],
        min: [0, 'La experiencia laboral no puede ser negativa'],
        max: [70, 'La experiencia laboral no puede ser mayor a 70 años']
    },
    habilidades: [{
        type: String,
        trim: true,
        maxlength: [50, 'Cada habilidad no puede exceder 50 caracteres']
    }],
    idiomas: [{
        idioma: {
            type: String,
            required: [true, 'El nombre del idioma es requerido'],
            trim: true,
            maxlength: [30, 'El nombre del idioma no puede exceder 30 caracteres']
        },
        nivel: {
            type: String,
            required: [true, 'El nivel del idioma es requerido'],
            enum: {
                values: ['Básico', 'Intermedio', 'Avanzado', 'Nativo'],
                message: 'El nivel debe ser: Básico, Intermedio, Avanzado o Nativo'
            }
        }
    }]
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Índices
pacienteSchema.index({ email: 1 }, { unique: true });
pacienteSchema.index({ nombre: 1 });
pacienteSchema.index({ profesion: 1 });

// Método virtual para obtener la edad en años
pacienteSchema.virtual('edadEnAnios').get(function() {
    return `${this.edad} años`;
});

// Método para obtener un resumen del perfil
pacienteSchema.methods.getResumenPerfil = function() {
    return {
        nombre: this.nombre,
        profesion: this.profesion,
        experiencia: `${this.experienciaLaboral} años`,
        educacion: this.nivelEducativo,
        contacto: this.email
    };
};

const Paciente = mongoose.model('Paciente', pacienteSchema);

module.exports = Paciente;