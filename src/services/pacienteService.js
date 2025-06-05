const Paciente = require('../models/Paciente');

class PacienteService {
    
    async getAllPacientes() {
        try {
            return await Paciente.find().sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error al obtener pacientes: ${error.message}`);
        }
    }

    async getPacienteById(id) {
        try {
            const paciente = await Paciente.findById(id);
            if (!paciente) {
                throw new Error('Paciente no encontrado');
            }
            return paciente;
        } catch (error) {
            throw new Error(`Error al obtener paciente: ${error.message}`);
        }
    }

    async getPacienteByEmail(email) {
        try {
            return await Paciente.findOne({ email: email.toLowerCase() });
        } catch (error) {
            throw new Error(`Error al buscar paciente por email: ${error.message}`);
        }
    }

    async createPaciente(name, email) {
        try {
            // Verificar si ya existe un paciente con ese email
            const existingPaciente = await Paciente.findOne({ email: email.toLowerCase() });
            if (existingPaciente) {
                throw new Error(`Ya existe un paciente con el email: ${email}`);
            }

            const paciente = new Paciente({
                name: name.trim(),
                email: email.toLowerCase().trim()
            });

            return await paciente.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new Error(`Ya existe un paciente con el email: ${email}`);
            }
            throw new Error(`Error al crear paciente: ${error.message}`);
        }
    }

    async updatePaciente(id, name, email) {
        try {
            const paciente = await Paciente.findById(id);
            if (!paciente) {
                throw new Error('Paciente no encontrado');
            }

            // Verificar si el nuevo email ya existe en otro paciente
            if (paciente.email !== email.toLowerCase()) {
                const existingPaciente = await Paciente.findOne({ 
                    email: email.toLowerCase(),
                    _id: { $ne: id }
                });
                if (existingPaciente) {
                    throw new Error(`Ya existe un paciente con el email: ${email}`);
                }
            }

            paciente.name = name.trim();
            paciente.email = email.toLowerCase().trim();
            
            return await paciente.save();
        } catch (error) {
            throw new Error(`Error al actualizar paciente: ${error.message}`);
        }
    }

    async deletePaciente(id) {
        try {
            const result = await Paciente.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Error al eliminar paciente: ${error.message}`);
        }
    }

    async countPacientes() {
        try {
            return await Paciente.countDocuments();
        } catch (error) {
            throw new Error(`Error al contar pacientes: ${error.message}`);
        }
    }
}

module.exports = new PacienteService();