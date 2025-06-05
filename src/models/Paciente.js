const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Índice único para email
pacienteSchema.index({ email: 1 }, { unique: true });

const Paciente = mongoose.model('Paciente', pacienteSchema);

module.exports = Paciente;