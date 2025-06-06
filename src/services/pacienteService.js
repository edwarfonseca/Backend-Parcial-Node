const Paciente = require('../models/Paciente');

class PacienteService {
    
    // Obtener todos los pacientes
    async getAllPacientes() {
        try {
            return await Paciente.find().sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error al obtener pacientes: ${error.message}`);
        }
    }

    // Obtener paciente por ID
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

    // Obtener paciente por email
    async getPacienteByEmail(email) {
        try {
            return await Paciente.findOne({ email: email.toLowerCase() });
        } catch (error) {
            throw new Error(`Error al buscar paciente por email: ${error.message}`);
        }
    }

    // Crear nuevo paciente
    async createPaciente(pacienteData) {
        try {
            // Verificar si ya existe un paciente con ese email
            const existingPaciente = await Paciente.findOne({ email: pacienteData.email.toLowerCase() });
            if (existingPaciente) {
                throw new Error(`Ya existe un paciente con el email: ${pacienteData.email}`);
            }

            // Convertir enums a formato de base de datos
            const pacienteFormatted = {
                ...pacienteData,
                email: pacienteData.email.toLowerCase().trim(),
                nombre: pacienteData.nombre.trim(),
                telefono: pacienteData.telefono.trim(),
                profesion: pacienteData.profesion.trim(),
                nivelEducativo: this.convertirNivelEducativo(pacienteData.nivelEducativo),
                habilidades: pacienteData.habilidades || [],
                idiomas: pacienteData.idiomas ? pacienteData.idiomas.map(idioma => ({
                    idioma: idioma.idioma.trim(),
                    nivel: this.convertirNivelIdioma(idioma.nivel)
                })) : []
            };

            const paciente = new Paciente(pacienteFormatted);
            return await paciente.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new Error(`Ya existe un paciente con el email: ${pacienteData.email}`);
            }
            throw new Error(`Error al crear paciente: ${error.message}`);
        }
    }

    // Actualizar paciente
    async updatePaciente(id, updateData) {
        try {
            const paciente = await Paciente.findById(id);
            if (!paciente) {
                throw new Error('Paciente no encontrado');
            }

            // Verificar si el nuevo email ya existe en otro paciente
            if (updateData.email && paciente.email !== updateData.email.toLowerCase()) {
                const existingPaciente = await Paciente.findOne({ 
                    email: updateData.email.toLowerCase(),
                    _id: { $ne: id }
                });
                if (existingPaciente) {
                    throw new Error(`Ya existe un paciente con el email: ${updateData.email}`);
                }
            }

            // Formatear datos de actualización
            const updateFormatted = {};
            
            if (updateData.nombre) updateFormatted.nombre = updateData.nombre.trim();
            if (updateData.edad !== undefined) updateFormatted.edad = updateData.edad;
            if (updateData.telefono) updateFormatted.telefono = updateData.telefono.trim();
            if (updateData.email) updateFormatted.email = updateData.email.toLowerCase().trim();
            if (updateData.nivelEducativo) updateFormatted.nivelEducativo = this.convertirNivelEducativo(updateData.nivelEducativo);
            if (updateData.profesion) updateFormatted.profesion = updateData.profesion.trim();
            if (updateData.experienciaLaboral !== undefined) updateFormatted.experienciaLaboral = updateData.experienciaLaboral;
            if (updateData.habilidades) updateFormatted.habilidades = updateData.habilidades;
            if (updateData.idiomas) {
                updateFormatted.idiomas = updateData.idiomas.map(idioma => ({
                    idioma: idioma.idioma.trim(),
                    nivel: this.convertirNivelIdioma(idioma.nivel)
                }));
            }

            return await Paciente.findByIdAndUpdate(id, updateFormatted, { 
                new: true, 
                runValidators: true 
            });
        } catch (error) {
            throw new Error(`Error al actualizar paciente: ${error.message}`);
        }
    }

    // Eliminar paciente
    async deletePaciente(id) {
        try {
            const result = await Paciente.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Error al eliminar paciente: ${error.message}`);
        }
    }

    // Contar pacientes
    async countPacientes() {
        try {
            return await Paciente.countDocuments();
        } catch (error) {
            throw new Error(`Error al contar pacientes: ${error.message}`);
        }
    }

    // Buscar pacientes con filtros
    async searchPacientes(filtros = {}, limite = 10, pagina = 1) {
        try {
            const query = {};
            
            if (filtros.nombre) {
                query.nombre = { $regex: filtros.nombre, $options: 'i' };
            }
            if (filtros.profesion) {
                query.profesion = { $regex: filtros.profesion, $options: 'i' };
            }
            if (filtros.nivelEducativo) {
                query.nivelEducativo = this.convertirNivelEducativo(filtros.nivelEducativo);
            }
            if (filtros.experienciaMinima !== undefined) {
                query.experienciaLaboral = { $gte: filtros.experienciaMinima };
            }
            if (filtros.experienciaMaxima !== undefined) {
                query.experienciaLaboral = { ...query.experienciaLaboral, $lte: filtros.experienciaMaxima };
            }
            if (filtros.edadMinima !== undefined) {
                query.edad = { $gte: filtros.edadMinima };
            }
            if (filtros.edadMaxima !== undefined) {
                query.edad = { ...query.edad, $lte: filtros.edadMaxima };
            }
            if (filtros.habilidad) {
                query.habilidades = { $in: [new RegExp(filtros.habilidad, 'i')] };
            }
            if (filtros.idioma) {
                query['idiomas.idioma'] = { $regex: filtros.idioma, $options: 'i' };
            }

            const skip = (pagina - 1) * limite;
            
            return await Paciente.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limite);
        } catch (error) {
            throw new Error(`Error al buscar pacientes: ${error.message}`);
        }
    }

    // Obtener pacientes por profesión
    async getPacientesByProfesion(profesion) {
        try {
            return await Paciente.find({ 
                profesion: { $regex: profesion, $options: 'i' }
            }).sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error al obtener pacientes por profesión: ${error.message}`);
        }
    }

    // Obtener pacientes por nivel educativo
    async getPacientesByNivelEducativo(nivel) {
        try {
            return await Paciente.find({ 
                nivelEducativo: this.convertirNivelEducativo(nivel)
            }).sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error al obtener pacientes por nivel educativo: ${error.message}`);
        }
    }

    // Obtener estadísticas
    async getEstadisticasPacientes() {
        try {
            const pacientes = await Paciente.find();
            const total = pacientes.length;
            
            if (total === 0) {
                return {
                    total: 0,
                    promedioEdad: 0,
                    promedioExperiencia: 0,
                    profesionMasComun: null,
                    nivelEducativoMasComun: null,
                    idiomaMasComun: null
                };
            }

            const promedioEdad = pacientes.reduce((sum, p) => sum + p.edad, 0) / total;
            const promedioExperiencia = pacientes.reduce((sum, p) => sum + p.experienciaLaboral, 0) / total;

            // Profesión más común
            const profesiones = {};
            pacientes.forEach(p => {
                profesiones[p.profesion] = (profesiones[p.profesion] || 0) + 1;
            });
            const profesionMasComun = Object.keys(profesiones).reduce((a, b) => 
                profesiones[a] > profesiones[b] ? a : b, null);

            // Nivel educativo más común
            const niveles = {};
            pacientes.forEach(p => {
                niveles[p.nivelEducativo] = (niveles[p.nivelEducativo] || 0) + 1;
            });
            const nivelEducativoMasComun = Object.keys(niveles).reduce((a, b) => 
                niveles[a] > niveles[b] ? a : b, null);

            // Idioma más común
            const idiomas = {};
            pacientes.forEach(p => {
                p.idiomas.forEach(i => {
                    idiomas[i.idioma] = (idiomas[i.idioma] || 0) + 1;
                });
            });
            const idiomaMasComun = Object.keys(idiomas).length > 0 ? 
                Object.keys(idiomas).reduce((a, b) => idiomas[a] > idiomas[b] ? a : b) : null;

            return {
                total,
                promedioEdad: Math.round(promedioEdad * 100) / 100,
                promedioExperiencia: Math.round(promedioExperiencia * 100) / 100,
                profesionMasComun,
                nivelEducativoMasComun,
                idiomaMasComun
            };
        } catch (error) {
            throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    }

    // Obtener pacientes con experiencia mínima
    async getPacientesConExperiencia(experienciaMinima) {
        try {
            return await Paciente.find({ 
                experienciaLaboral: { $gte: experienciaMinima }
            }).sort({ experienciaLaboral: -1 });
        } catch (error) {
            throw new Error(`Error al obtener pacientes con experiencia: ${error.message}`);
        }
    }

    // Obtener pacientes por idioma
    async getPacientesPorIdioma(idioma) {
        try {
            return await Paciente.find({
                'idiomas.idioma': { $regex: idioma, $options: 'i' }
            }).sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error al obtener pacientes por idioma: ${error.message}`);
        }
    }

    // Agregar habilidad
    async addHabilidad(id, habilidad) {
        try {
            const paciente = await Paciente.findById(id);
            if (!paciente) {
                throw new Error('Paciente no encontrado');
            }

            if (!paciente.habilidades.includes(habilidad)) {
                paciente.habilidades.push(habilidad);
                return await paciente.save();
            }
            
            throw new Error('La habilidad ya existe');
        } catch (error) {
            throw new Error(`Error al agregar habilidad: ${error.message}`);
        }
    }

    // Remover habilidad
    async removeHabilidad(id, habilidad) {
        try {
            const paciente = await Paciente.findById(id);
            if (!paciente) {
                throw new Error('Paciente no encontrado');
            }

            paciente.habilidades = paciente.habilidades.filter(h => h !== habilidad);
            return await paciente.save();
        } catch (error) {
            throw new Error(`Error al remover habilidad: ${error.message}`);
        }
    }

    // Agregar idioma
    async addIdioma(id, idiomaData) {
        try {
            const paciente = await Paciente.findById(id);
            if (!paciente) {
                throw new Error('Paciente no encontrado');
            }

            const existeIdioma = paciente.idiomas.find(i => 
                i.idioma.toLowerCase() === idiomaData.idioma.toLowerCase());
            
            if (existeIdioma) {
                throw new Error('El idioma ya existe');
            }

            paciente.idiomas.push({
                idioma: idiomaData.idioma.trim(),
                nivel: this.convertirNivelIdioma(idiomaData.nivel)
            });
            
            return await paciente.save();
        } catch (error) {
            throw new Error(`Error al agregar idioma: ${error.message}`);
        }
    }

    // Remover idioma
    async removeIdioma(id, idioma) {
        try {
            const paciente = await Paciente.findById(id);
            if (!paciente) {
                throw new Error('Paciente no encontrado');
            }

            paciente.idiomas = paciente.idiomas.filter(i => 
                i.idioma.toLowerCase() !== idioma.toLowerCase());
            
            return await paciente.save();
        } catch (error) {
            throw new Error(`Error al remover idioma: ${error.message}`);
        }
    }

    // Actualizar nivel de idioma
    async updateNivelIdioma(id, idioma, nuevoNivel) {
        try {
            const paciente = await Paciente.findById(id);
            if (!paciente) {
                throw new Error('Paciente no encontrado');
            }

            const idiomaEncontrado = paciente.idiomas.find(i => 
                i.idioma.toLowerCase() === idioma.toLowerCase());
            
            if (!idiomaEncontrado) {
                throw new Error('Idioma no encontrado');
            }

            idiomaEncontrado.nivel = this.convertirNivelIdioma(nuevoNivel);
            return await paciente.save();
        } catch (error) {
            throw new Error(`Error al actualizar nivel de idioma: ${error.message}`);
        }
    }
    
    async getPacientesByNivelEducativo(nivel) {
        return await Paciente.find({ 
            nivelEducativo: this.convertirNivelEducativo(nivel)
    });
}

    // Métodos auxiliares para convertir enums
    convertirNivelEducativo(nivel) {
        const niveles = {
            'PRIMARIA': 'Primaria',
            'SECUNDARIA': 'Secundaria',
            'TECNICO': 'Técnico',
            'TECNOLOGICO': 'Tecnológico',
            'UNIVERSITARIO': 'Universitario',
            'POSGRADO': 'Posgrado',
            'MAESTRIA': 'Maestría',
            'DOCTORADO': 'Doctorado'
        };
        return niveles[nivel] || nivel;
    }

    convertirNivelIdioma(nivel) {
        const niveles = {
            'BASICO': 'Básico',
            'INTERMEDIO': 'Intermedio',
            'AVANZADO': 'Avanzado',
            'NATIVO': 'Nativo'
        };
        return niveles[nivel] || nivel;
    }
}

module.exports = new PacienteService();