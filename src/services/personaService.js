const Persona = require('../models/Persona');

class personaService {
    
    // Obtener todos los Personas
    async getAllPersonas() {
        try {
            return await Persona.find().sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error al obtener Personas: ${error.message}`);
        }
    }

    // Obtener Persona por ID
    async getPersonaById(id) {
        try {
            const Persona = await Persona.findById(id);
            if (!Persona) {
                throw new Error('Persona no encontrado');
            }
            return Persona;
        } catch (error) {
            throw new Error(`Error al obtener Persona: ${error.message}`);
        }
    }

    // Obtener Persona por email
    async getPersonaByEmail(email) {
        try {
            return await Persona.findOne({ email: email.toLowerCase() });
        } catch (error) {
            throw new Error(`Error al buscar Persona por email: ${error.message}`);
        }
    }

    // Crear nuevo Persona
    async createPersona(PersonaData) {
        try {
            // Verificar si ya existe un Persona con ese email
            const existingPersona = await Persona.findOne({ email: PersonaData.email.toLowerCase() });
            if (existingPersona) {
                throw new Error(`Ya existe un Persona con el email: ${PersonaData.email}`);
            }

            // Convertir enums a formato de base de datos
            const PersonaFormatted = {
                ...PersonaData,
                email: PersonaData.email.toLowerCase().trim(),
                nombre: PersonaData.nombre.trim(),
                telefono: PersonaData.telefono.trim(),
                profesion: PersonaData.profesion.trim(),
                nivelEducativo: this.convertirNivelEducativo(PersonaData.nivelEducativo),
                habilidades: PersonaData.habilidades || [],
                idiomas: PersonaData.idiomas ? PersonaData.idiomas.map(idioma => ({
                    idioma: idioma.idioma.trim(),
                    nivel: this.convertirNivelIdioma(idioma.nivel)
                })) : []
            };

            const Persona = new Persona(PersonaFormatted);
            return await Persona.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new Error(`Ya existe un Persona con el email: ${PersonaData.email}`);
            }
            throw new Error(`Error al crear Persona: ${error.message}`);
        }
    }

    // Actualizar Persona
    async updatePersona(id, updateData) {
        try {
            const Persona = await Persona.findById(id);
            if (!Persona) {
                throw new Error('Persona no encontrado');
            }

            // Verificar si el nuevo email ya existe en otro Persona
            if (updateData.email && Persona.email !== updateData.email.toLowerCase()) {
                const existingPersona = await Persona.findOne({ 
                    email: updateData.email.toLowerCase(),
                    _id: { $ne: id }
                });
                if (existingPersona) {
                    throw new Error(`Ya existe un Persona con el email: ${updateData.email}`);
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

            return await Persona.findByIdAndUpdate(id, updateFormatted, { 
                new: true, 
                runValidators: true 
            });
        } catch (error) {
            throw new Error(`Error al actualizar Persona: ${error.message}`);
        }
    }

    // Eliminar Persona
    async deletePersona(id) {
        try {
            const result = await Persona.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Error al eliminar Persona: ${error.message}`);
        }
    }

    // Contar Personas
    async countPersonas() {
        try {
            return await Persona.countDocuments();
        } catch (error) {
            throw new Error(`Error al contar Personas: ${error.message}`);
        }
    }

    // Buscar Personas con filtros
    async searchPersonas(filtros = {}, limite = 10, pagina = 1) {
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
            
            return await Persona.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limite);
        } catch (error) {
            throw new Error(`Error al buscar Personas: ${error.message}`);
        }
    }

    // Obtener Personas por profesión
    async getPersonasByProfesion(profesion) {
        try {
            return await Persona.find({ 
                profesion: { $regex: profesion, $options: 'i' }
            }).sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error al obtener Personas por profesión: ${error.message}`);
        }
    }

    // Obtener Personas por nivel educativo
    async getPersonasByNivelEducativo(nivel) {
        try {
            return await Persona.find({ 
                nivelEducativo: this.convertirNivelEducativo(nivel)
            }).sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error al obtener Personas por nivel educativo: ${error.message}`);
        }
    }

    // Obtener estadísticas
    async getEstadisticasPersonas() {
        try {
            const Personas = await Persona.find();
            const total = Personas.length;
            
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

            const promedioEdad = Personas.reduce((sum, p) => sum + p.edad, 0) / total;
            const promedioExperiencia = Personas.reduce((sum, p) => sum + p.experienciaLaboral, 0) / total;

            // Profesión más común
            const profesiones = {};
            Personas.forEach(p => {
                profesiones[p.profesion] = (profesiones[p.profesion] || 0) + 1;
            });
            const profesionMasComun = Object.keys(profesiones).reduce((a, b) => 
                profesiones[a] > profesiones[b] ? a : b, null);

            // Nivel educativo más común
            const niveles = {};
            Personas.forEach(p => {
                niveles[p.nivelEducativo] = (niveles[p.nivelEducativo] || 0) + 1;
            });
            const nivelEducativoMasComun = Object.keys(niveles).reduce((a, b) => 
                niveles[a] > niveles[b] ? a : b, null);

            // Idioma más común
            const idiomas = {};
            Personas.forEach(p => {
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

    // Obtener Personas con experiencia mínima
    async getPersonasConExperiencia(experienciaMinima) {
        try {
            return await Persona.find({ 
                experienciaLaboral: { $gte: experienciaMinima }
            }).sort({ experienciaLaboral: -1 });
        } catch (error) {
            throw new Error(`Error al obtener Personas con experiencia: ${error.message}`);
        }
    }

    // Obtener Personas por idioma
    async getPersonasPorIdioma(idioma) {
        try {
            return await Persona.find({
                'idiomas.idioma': { $regex: idioma, $options: 'i' }
            }).sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error al obtener Personas por idioma: ${error.message}`);
        }
    }

    // Agregar habilidad
    async addHabilidad(id, habilidad) {
        try {
            const Persona = await Persona.findById(id);
            if (!Persona) {
                throw new Error('Persona no encontrado');
            }

            if (!Persona.habilidades.includes(habilidad)) {
                Persona.habilidades.push(habilidad);
                return await Persona.save();
            }
            
            throw new Error('La habilidad ya existe');
        } catch (error) {
            throw new Error(`Error al agregar habilidad: ${error.message}`);
        }
    }

    // Remover habilidad
    async removeHabilidad(id, habilidad) {
        try {
            const Persona = await Persona.findById(id);
            if (!Persona) {
                throw new Error('Persona no encontrado');
            }

            Persona.habilidades = Persona.habilidades.filter(h => h !== habilidad);
            return await Persona.save();
        } catch (error) {
            throw new Error(`Error al remover habilidad: ${error.message}`);
        }
    }

    // Agregar idioma
    async addIdioma(id, idiomaData) {
        try {
            const Persona = await Persona.findById(id);
            if (!Persona) {
                throw new Error('Persona no encontrado');
            }

            const existeIdioma = Persona.idiomas.find(i => 
                i.idioma.toLowerCase() === idiomaData.idioma.toLowerCase());
            
            if (existeIdioma) {
                throw new Error('El idioma ya existe');
            }

            Persona.idiomas.push({
                idioma: idiomaData.idioma.trim(),
                nivel: this.convertirNivelIdioma(idiomaData.nivel)
            });
            
            return await Persona.save();
        } catch (error) {
            throw new Error(`Error al agregar idioma: ${error.message}`);
        }
    }

    // Remover idioma
    async removeIdioma(id, idioma) {
        try {
            const Persona = await Persona.findById(id);
            if (!Persona) {
                throw new Error('Persona no encontrado');
            }

            Persona.idiomas = Persona.idiomas.filter(i => 
                i.idioma.toLowerCase() !== idioma.toLowerCase());
            
            return await Persona.save();
        } catch (error) {
            throw new Error(`Error al remover idioma: ${error.message}`);
        }
    }

    // Actualizar nivel de idioma
    async updateNivelIdioma(id, idioma, nuevoNivel) {
        try {
            const Persona = await Persona.findById(id);
            if (!Persona) {
                throw new Error('Persona no encontrado');
            }

            const idiomaEncontrado = Persona.idiomas.find(i => 
                i.idioma.toLowerCase() === idioma.toLowerCase());
            
            if (!idiomaEncontrado) {
                throw new Error('Idioma no encontrado');
            }

            idiomaEncontrado.nivel = this.convertirNivelIdioma(nuevoNivel);
            return await Persona.save();
        } catch (error) {
            throw new Error(`Error al actualizar nivel de idioma: ${error.message}`);
        }
    }
    
    async getPersonasByNivelEducativo(nivel) {
        return await Persona.find({ 
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

module.exports = new personaService();