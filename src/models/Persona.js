// src/models/Persona.js
const mongoose = require('mongoose');

const personaSchema = new mongoose.Schema({
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
    }
}, {
    timestamps: true
});

// Índices - AQUÍ ESTÁ LA CORRECCIÓN
personaSchema.index({ email: 1 }, { unique: true });
personaSchema.index({ nombre: 1 });

const Persona = mongoose.model('Persona', personaSchema);

module.exports = Persona;