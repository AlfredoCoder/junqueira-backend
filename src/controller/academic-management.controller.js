// controller/academic-management.controller.js
import { AcademicManagementService } from "../services/academic-management.services.js";
import { handleControllerError } from "../utils/validation.utils.js";
import {
  anoLectivoCreateSchema,
  anoLectivoUpdateSchema,
  anoLectivoFlexibleCreateSchema,
  cursoCreateSchema,
  cursoUpdateSchema,
  cursoFlexibleCreateSchema,
  classeCreateSchema,
  classeUpdateSchema,
  disciplinaCreateSchema,
  disciplinaUpdateSchema,
  disciplinaFlexibleCreateSchema,
  salaCreateSchema,
  salaUpdateSchema,
  periodoCreateSchema,
  periodoUpdateSchema,
  turmaCreateSchema,
  turmaUpdateSchema,
  turmaFlexibleCreateSchema,
  gradeCurricularCreateSchema,
  gradeCurricularUpdateSchema,
  gradeCurricularByTurmaSchema,
  idParamSchema,
  gradeByCursoClasseSchema,
  turmasByAnoLectivoSchema,
  batchCursoCreateSchema,
  batchDisciplinaCreateSchema,
  batchTurmaCreateSchema
} from "../validations/academic-management.validations.js";

export class AcademicManagementController {
  // ===============================
  // ANO LETIVO - CRUD COMPLETO
  // ===============================

  static async createAnoLectivo(req, res) {
    try {
      // Tentar primeiro o schema flexível, depois o padrão
      let validatedData;
      try {
        validatedData = anoLectivoFlexibleCreateSchema.parse(req.body);
      } catch {
        validatedData = anoLectivoCreateSchema.parse(req.body);
      }

      const anoLectivo = await AcademicManagementService.createAnoLectivo(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Ano letivo criado com sucesso",
        data: anoLectivo,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar ano letivo", 400);
    }
  }

  static async updateAnoLectivo(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = anoLectivoUpdateSchema.parse(req.body);

      const anoLectivo = await AcademicManagementService.updateAnoLectivo(id, validatedData);
      
      res.json({
        success: true,
        message: "Ano letivo atualizado com sucesso",
        data: anoLectivo,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar ano letivo", 400);
    }
  }

  static async getAnosLectivos(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await AcademicManagementService.getAnosLectivos(page, limit, search);
      
      res.json({
        success: true,
        message: "Anos letivos encontrados",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar anos letivos", 400);
    }
  }

  static async getAnoLectivoById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const anoLectivo = await AcademicManagementService.getAnoLectivoById(id);
      
      res.json({
        success: true,
        message: "Ano letivo encontrado",
        data: anoLectivo,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar ano letivo", 400);
    }
  }

  static async deleteAnoLectivo(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await AcademicManagementService.deleteAnoLectivo(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir ano letivo", 400);
    }
  }

  // ===============================
  // CURSOS - CRUD COMPLETO
  // ===============================

  static async createCurso(req, res) {
    try {
      // Tentar primeiro o schema flexível, depois o padrão
      let validatedData;
      try {
        validatedData = cursoFlexibleCreateSchema.parse(req.body);
      } catch {
        validatedData = cursoCreateSchema.parse(req.body);
      }

      const curso = await AcademicManagementService.createCurso(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Curso criado com sucesso",
        data: curso,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar curso", 400);
    }
  }

  static async updateCurso(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = cursoUpdateSchema.parse(req.body);

      const curso = await AcademicManagementService.updateCurso(id, validatedData);
      
      res.json({
        success: true,
        message: "Curso atualizado com sucesso",
        data: curso,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar curso", 400);
    }
  }

  static async getCursos(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await AcademicManagementService.getCursos(page, limit, search);
      
      res.json({
        success: true,
        message: "Cursos encontrados",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar cursos", 400);
    }
  }

  static async getCursoById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const curso = await AcademicManagementService.getCursoById(id);
      
      res.json({
        success: true,
        message: "Curso encontrado",
        data: curso,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar curso", 400);
    }
  }

  static async deleteCurso(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await AcademicManagementService.deleteCurso(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir curso", 400);
    }
  }

  // ===============================
  // CLASSES - CRUD COMPLETO
  // ===============================

  static async createClasse(req, res) {
    try {
      const validatedData = classeCreateSchema.parse(req.body);

      const classe = await AcademicManagementService.createClasse(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Classe criada com sucesso",
        data: classe,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar classe", 400);
    }
  }

  static async updateClasse(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = classeUpdateSchema.parse(req.body);

      const classe = await AcademicManagementService.updateClasse(id, validatedData);
      
      res.json({
        success: true,
        message: "Classe atualizada com sucesso",
        data: classe,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar classe", 400);
    }
  }

  static async getClasses(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await AcademicManagementService.getClasses(page, limit, search);
      
      res.json({
        success: true,
        message: "Classes encontradas",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar classes", 400);
    }
  }

  static async getClasseById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const classe = await AcademicManagementService.getClasseById(id);
      
      res.json({
        success: true,
        message: "Classe encontrada",
        data: classe,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar classe", 400);
    }
  }

  static async deleteClasse(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await AcademicManagementService.deleteClasse(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir classe", 400);
    }
  }

  // ===============================
  // DISCIPLINAS - CRUD COMPLETO
  // ===============================

  static async createDisciplina(req, res) {
    try {
      // Tentar primeiro o schema flexível, depois o padrão
      let validatedData;
      try {
        validatedData = disciplinaFlexibleCreateSchema.parse(req.body);
      } catch {
        validatedData = disciplinaCreateSchema.parse(req.body);
      }

      const disciplina = await AcademicManagementService.createDisciplina(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Disciplina criada com sucesso",
        data: disciplina,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar disciplina", 400);
    }
  }

  static async updateDisciplina(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = disciplinaUpdateSchema.parse(req.body);

      const disciplina = await AcademicManagementService.updateDisciplina(id, validatedData);
      
      res.json({
        success: true,
        message: "Disciplina atualizada com sucesso",
        data: disciplina,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar disciplina", 400);
    }
  }

  static async getDisciplinas(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await AcademicManagementService.getDisciplinas(page, limit, search);
      
      res.json({
        success: true,
        message: "Disciplinas encontradas",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar disciplinas", 400);
    }
  }

  static async getDisciplinaById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const disciplina = await AcademicManagementService.getDisciplinaById(id);
      
      res.json({
        success: true,
        message: "Disciplina encontrada",
        data: disciplina,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar disciplina", 400);
    }
  }

  static async deleteDisciplina(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await AcademicManagementService.deleteDisciplina(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir disciplina", 400);
    }
  }

  static async getDisciplineStatistics(req, res) {
    try {
      const statistics = await AcademicManagementService.getDisciplineStatistics();
      
      res.json({
        success: true,
        message: "Estatísticas de disciplinas obtidas com sucesso",
        data: statistics,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar estatísticas de disciplinas", 400);
    }
  }

  // ===============================
  // SALAS - CRUD COMPLETO
  // ===============================

  static async createSala(req, res) {
    try {
      const validatedData = salaCreateSchema.parse(req.body);

      const sala = await AcademicManagementService.createSala(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Sala criada com sucesso",
        data: sala,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar sala", 400);
    }
  }

  static async updateSala(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = salaUpdateSchema.parse(req.body);

      const sala = await AcademicManagementService.updateSala(id, validatedData);
      
      res.json({
        success: true,
        message: "Sala atualizada com sucesso",
        data: sala,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar sala", 400);
    }
  }

  static async getSalas(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await AcademicManagementService.getSalas(page, limit, search);
      
      res.json({
        success: true,
        message: "Salas encontradas",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar salas", 400);
    }
  }

  static async getSalaById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const sala = await AcademicManagementService.getSalaById(id);
      
      res.json({
        success: true,
        message: "Sala encontrada",
        data: sala,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar sala", 400);
    }
  }

  static async deleteSala(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await AcademicManagementService.deleteSala(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir sala", 400);
    }
  }

  // ===============================
  // PERÍODOS - CRUD COMPLETO
  // ===============================

  static async createPeriodo(req, res) {
    try {
      const validatedData = periodoCreateSchema.parse(req.body);

      const periodo = await AcademicManagementService.createPeriodo(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Período criado com sucesso",
        data: periodo,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar período", 400);
    }
  }

  static async updatePeriodo(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = periodoUpdateSchema.parse(req.body);

      const periodo = await AcademicManagementService.updatePeriodo(id, validatedData);
      
      res.json({
        success: true,
        message: "Período atualizado com sucesso",
        data: periodo,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar período", 400);
    }
  }

  static async getPeriodos(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await AcademicManagementService.getPeriodos(page, limit, search);
      
      res.json({
        success: true,
        message: "Períodos encontrados",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar períodos", 400);
    }
  }

  static async getPeriodoById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const periodo = await AcademicManagementService.getPeriodoById(id);
      
      res.json({
        success: true,
        message: "Período encontrado",
        data: periodo,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar período", 400);
    }
  }

  static async deletePeriodo(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await AcademicManagementService.deletePeriodo(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir período", 400);
    }
  }

  // ===============================
  // TURMAS - CRUD COMPLETO
  // ===============================

  static async createTurma(req, res) {
    try {
      // Tentar primeiro o schema flexível, depois o padrão
      let validatedData;
      try {
        validatedData = turmaFlexibleCreateSchema.parse(req.body);
      } catch {
        validatedData = turmaCreateSchema.parse(req.body);
      }

      const turma = await AcademicManagementService.createTurma(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Turma criada com sucesso",
        data: turma,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar turma", 400);
    }
  }

  static async updateTurma(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = turmaUpdateSchema.parse(req.body);

      const turma = await AcademicManagementService.updateTurma(id, validatedData);
      
      res.json({
        success: true,
        message: "Turma atualizada com sucesso",
        data: turma,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar turma", 400);
    }
  }

  static async getTurmas(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await AcademicManagementService.getTurmas(page, limit, search);
      
      res.json({
        success: true,
        message: "Turmas encontradas",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar turmas", 400);
    }
  }

  static async getTurmaById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const turma = await AcademicManagementService.getTurmaById(id);
      
      res.json({
        success: true,
        message: "Turma encontrada",
        data: turma,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar turma", 400);
    }
  }

  static async deleteTurma(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await AcademicManagementService.deleteTurma(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir turma", 400);
    }
  }

  // ===============================
  // GRADE CURRICULAR - CRUD COMPLETO
  // ===============================

  static async createGradeCurricular(req, res) {
    try {
      const validatedData = gradeCurricularCreateSchema.parse(req.body);

      const gradeCurricular = await AcademicManagementService.createGradeCurricular(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Grade curricular criada com sucesso",
        data: gradeCurricular,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar grade curricular", 400);
    }
  }

  static async createGradeCurricularByTurma(req, res) {
    try {
      const validatedData = gradeCurricularByTurmaSchema.parse(req.body);

      const gradeCurricular = await AcademicManagementService.createGradeCurricularByTurma(validatedData);
      
      res.status(201).json({
        success: true,
        message: gradeCurricular.message,
        data: gradeCurricular.data,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar grade curricular", 400);
    }
  }

  static async updateGradeCurricular(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = gradeCurricularUpdateSchema.parse(req.body);

      const gradeCurricular = await AcademicManagementService.updateGradeCurricular(id, validatedData);
      
      res.json({
        success: true,
        message: "Grade curricular atualizada com sucesso",
        data: gradeCurricular,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar grade curricular", 400);
    }
  }

  static async deleteGradeCurricular(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await AcademicManagementService.deleteGradeCurricular(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir grade curricular", 400);
    }
  }

  static async getGradeCurricular(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await AcademicManagementService.getGradeCurricular(page, limit, search);
      
      res.json({
        success: true,
        message: "Grade curricular encontrada",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar grade curricular", 400);
    }
  }

  static async getGradeCurricularById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const gradeCurricular = await AcademicManagementService.getGradeCurricularById(id);
      
      res.json({
        success: true,
        message: "Grade curricular encontrada",
        data: gradeCurricular,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar grade curricular", 400);
    }
  }

  // ===============================
  // OPERAÇÕES ESPECIAIS
  // ===============================

  static async getGradeByCursoAndClasse(req, res) {
    try {
      const { codigo_Curso, codigo_Classe } = gradeByCursoClasseSchema.parse(req.params);

      const grade = await AcademicManagementService.getGradeByCursoAndClasse(codigo_Curso, codigo_Classe);
      
      res.json({
        success: true,
        message: "Grade curricular obtida com sucesso",
        data: grade,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter grade curricular", 400);
    }
  }

  static async getTurmasByAnoLectivo(req, res) {
    try {
      const { codigo_AnoLectivo } = turmasByAnoLectivoSchema.parse(req.params);

      const turmas = await AcademicManagementService.getTurmasByAnoLectivo(codigo_AnoLectivo);
      
      res.json({
        success: true,
        message: "Turmas do ano letivo obtidas com sucesso",
        data: turmas,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter turmas do ano letivo", 400);
    }
  }

  // Estatísticas de cursos
  static async getCourseStatistics(req, res) {
    try {
      const stats = await AcademicManagementService.getCourseStatistics();

      res.json({
        success: true,
        message: "Estatísticas de cursos obtidas com sucesso",
        data: stats,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter estatísticas de cursos", 400);
    }
  }

  // ===============================
  // OPERAÇÕES EM LOTE (BATCH)
  // ===============================

  static async createMultipleCursos(req, res) {
    try {
      const { cursos } = batchCursoCreateSchema.parse(req.body);

      const results = [];
      const errors = [];

      for (let i = 0; i < cursos.length; i++) {
        try {
          let validatedData;
          try {
            validatedData = cursoFlexibleCreateSchema.parse(cursos[i]);
          } catch {
            validatedData = cursoCreateSchema.parse(cursos[i]);
          }

          const curso = await AcademicManagementService.createCurso(validatedData);
          results.push({ index: i, success: true, data: curso });
        } catch (error) {
          errors.push({ 
            index: i, 
            success: false, 
            error: error.message,
            data: cursos[i]
          });
        }
      }
      
      res.status(201).json({
        success: true,
        message: `Processamento concluído. ${results.length} cursos criados, ${errors.length} erros`,
        data: {
          created: results,
          errors: errors,
          summary: {
            total: cursos.length,
            success: results.length,
            failed: errors.length
          }
        },
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar múltiplos cursos", 400);
    }
  }

  static async createMultipleDisciplinas(req, res) {
    try {
      const { disciplinas } = batchDisciplinaCreateSchema.parse(req.body);

      const results = [];
      const errors = [];

      for (let i = 0; i < disciplinas.length; i++) {
        try {
          let validatedData;
          try {
            validatedData = disciplinaFlexibleCreateSchema.parse(disciplinas[i]);
          } catch {
            validatedData = disciplinaCreateSchema.parse(disciplinas[i]);
          }

          const disciplina = await AcademicManagementService.createDisciplina(validatedData);
          results.push({ index: i, success: true, data: disciplina });
        } catch (error) {
          errors.push({ 
            index: i, 
            success: false, 
            error: error.message,
            data: disciplinas[i]
          });
        }
      }
      
      res.status(201).json({
        success: true,
        message: `Processamento concluído. ${results.length} disciplinas criadas, ${errors.length} erros`,
        data: {
          created: results,
          errors: errors,
          summary: {
            total: disciplinas.length,
            success: results.length,
            failed: errors.length
          }
        },
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar múltiplas disciplinas", 400);
    }
  }

  static async createMultipleTurmas(req, res) {
    try {
      const { turmas } = batchTurmaCreateSchema.parse(req.body);

      const results = [];
      const errors = [];

      for (let i = 0; i < turmas.length; i++) {
        try {
          let validatedData;
          try {
            validatedData = turmaFlexibleCreateSchema.parse(turmas[i]);
          } catch {
            validatedData = turmaCreateSchema.parse(turmas[i]);
          }

          const turma = await AcademicManagementService.createTurma(validatedData);
          results.push({ index: i, success: true, data: turma });
        } catch (error) {
          errors.push({ 
            index: i, 
            success: false, 
            error: error.message,
            data: turmas[i]
          });
        }
      }
      
      res.status(201).json({
        success: true,
        message: `Processamento concluído. ${results.length} turmas criadas, ${errors.length} erros`,
        data: {
          created: results,
          errors: errors,
          summary: {
            total: turmas.length,
            success: results.length,
            failed: errors.length
          }
        },
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar múltiplas turmas", 400);
    }
  }

  // ===============================
  // OPERAÇÕES DE CONSULTA AVANÇADA
  // ===============================

  static async getDisciplinasByCurso(req, res) {
    try {
      const { codigo_Curso } = req.params;
      
      if (!codigo_Curso || isNaN(parseInt(codigo_Curso))) {
        return res.status(400).json({
          success: false,
          message: "Código do curso deve ser um número válido",
        });
      }

      // Usar o service existente para buscar disciplinas
      const disciplinas = await AcademicManagementService.getDisciplinasByCurso(parseInt(codigo_Curso));
      
      res.json({
        success: true,
        message: "Disciplinas do curso obtidas com sucesso",
        data: disciplinas,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter disciplinas do curso", 400);
    }
  }

  static async getTurmasByClasseAndCurso(req, res) {
    try {
      const { codigo_Classe, codigo_Curso } = req.params;
      
      if (!codigo_Classe || !codigo_Curso || isNaN(parseInt(codigo_Classe)) || isNaN(parseInt(codigo_Curso))) {
        return res.status(400).json({
          success: false,
          message: "Códigos da classe e curso devem ser números válidos",
        });
      }

      const turmas = await AcademicManagementService.getTurmasByClasseAndCurso(
        parseInt(codigo_Classe), 
        parseInt(codigo_Curso)
      );
      
      res.json({
        success: true,
        message: "Turmas obtidas com sucesso",
        data: turmas,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter turmas", 400);
    }
  }

  // ===============================
  // RELATÓRIOS DE ALUNOS POR TURMA
  // ===============================

  static async getAlunosByTurma(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: "ID da turma deve ser um número válido",
        });
      }

      const alunos = await AcademicManagementService.getAlunosByTurma(parseInt(id));
      
      res.json({
        success: true,
        message: `${alunos.length} alunos encontrados na turma`,
        data: alunos,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter alunos da turma", 400);
    }
  }

  static async getRelatorioCompletoTurmas(req, res) {
    try {
      const { ano_lectivo } = req.query;
      const relatorio = await AcademicManagementService.getRelatorioCompletoTurmas(ano_lectivo);
      
      res.json({
        success: true,
        message: `Relatório completo de ${relatorio.length} turmas gerado`,
        data: relatorio,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao gerar relatório completo", 400);
    }
  }

  /**
   * Buscar alunos de uma turma específica
   */
  static async getAlunosByTurma(req, res) {
    try {
      const { id } = req.params;
      const turmaId = parseInt(id);

      if (!turmaId || isNaN(turmaId)) {
        return res.status(400).json({
          success: false,
          message: 'ID da turma inválido'
        });
      }

      const alunos = await AcademicManagementService.getAlunosByTurma(turmaId);
      
      res.json({
        success: true,
        message: `${alunos.length} alunos encontrados na turma`,
        data: alunos
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar alunos da turma", 400);
    }
  }

  // ========== SALAS - CRUD ==========

  // Criar sala
  static async createSala(req, res) {
    try {
      const { designacao } = req.body;

      // Validações básicas
      if (!designacao) {
        return res.status(400).json({
          success: false,
          message: 'Designação é obrigatória'
        });
      }

      const sala = await AcademicManagementService.createSala({ designacao });

      res.status(201).json({
        success: true,
        message: 'Sala criada com sucesso',
        data: sala
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar sala", 400);
    }
  }

  // Listar salas
  static async getSalas(req, res) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      
      const result = await AcademicManagementService.getSalas({
        page: parseInt(page),
        limit: parseInt(limit),
        search
      });

      res.json({
        success: true,
        message: 'Salas encontradas',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar salas", 400);
    }
  }

  // Buscar sala por ID
  static async getSalaById(req, res) {
    try {
      const { id } = req.params;
      const sala = await AcademicManagementService.getSalaById(parseInt(id));

      if (!sala) {
        return res.status(404).json({
          success: false,
          message: 'Sala não encontrada'
        });
      }

      res.json({
        success: true,
        data: sala
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar sala", 400);
    }
  }

  // Atualizar sala
  static async updateSala(req, res) {
    try {
      const { id } = req.params;
      const { designacao } = req.body;

      const sala = await AcademicManagementService.updateSala(parseInt(id), { designacao });

      res.json({
        success: true,
        message: 'Sala atualizada com sucesso',
        data: sala
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar sala", 400);
    }
  }

  // Excluir sala
  static async deleteSala(req, res) {
    try {
      const { id } = req.params;
      await AcademicManagementService.deleteSala(parseInt(id));

      res.json({
        success: true,
        message: 'Sala excluída com sucesso'
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir sala", 400);
    }
  }
}
