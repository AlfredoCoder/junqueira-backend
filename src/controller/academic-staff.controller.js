// controller/academic-staff.controller.js
import { AcademicStaffService } from "../services/academic-staff.services.js";
import { handleControllerError } from "../utils/validation.utils.js";
import {
  especialidadeCreateSchema,
  especialidadeUpdateSchema,
  docenteCreateSchema,
  docenteUpdateSchema,
  disciplinaDocenteCreateSchema,
  diretorTurmaCreateSchema,
  docenteTurmaCreateSchema,
  idParamSchema
} from "../validations/academic-staff.validations.js";

export class AcademicStaffController {
  // ===============================
  // ESPECIALIDADES - CRUD COMPLETO
  // ===============================

  static async createEspecialidade(req, res) {
    try {
      const validatedData = especialidadeCreateSchema.parse(req.body);
      const especialidade = await AcademicStaffService.createEspecialidade(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Especialidade criada com sucesso",
        data: especialidade,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar especialidade", 400);
    }
  }

  static async updateEspecialidade(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = especialidadeUpdateSchema.parse(req.body);

      const especialidade = await AcademicStaffService.updateEspecialidade(id, validatedData);
      
      res.json({
        success: true,
        message: "Especialidade atualizada com sucesso",
        data: especialidade,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar especialidade", 400);
    }
  }

  static async getEspecialidades(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await AcademicStaffService.getEspecialidades(page, limit, search);
      
      res.json({
        success: true,
        message: "Especialidades encontradas",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar especialidades", 400);
    }
  }

  static async getEspecialidadeById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const especialidade = await AcademicStaffService.getEspecialidadeById(id);
      
      res.json({
        success: true,
        message: "Especialidade encontrada",
        data: especialidade,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar especialidade", 400);
    }
  }

  static async deleteEspecialidade(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await AcademicStaffService.deleteEspecialidade(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir especialidade", 400);
    }
  }

  // ===============================
  // DOCENTES - CRUD COMPLETO
  // ===============================

  static async createDocente(req, res) {
    try {
      const validatedData = docenteCreateSchema.parse(req.body);
      const docente = await AcademicStaffService.createDocente(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Docente criado com sucesso",
        data: docente,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar docente", 400);
    }
  }

  static async updateDocente(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = docenteUpdateSchema.parse(req.body);

      const docente = await AcademicStaffService.updateDocente(id, validatedData);
      
      res.json({
        success: true,
        message: "Docente atualizado com sucesso",
        data: docente,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar docente", 400);
    }
  }

  static async getDocentes(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await AcademicStaffService.getDocentes(page, limit, search);
      
      res.json({
        success: true,
        message: "Docentes encontrados",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar docentes", 400);
    }
  }

  static async getDocenteById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const docente = await AcademicStaffService.getDocenteById(id);
      
      res.json({
        success: true,
        message: "Docente encontrado",
        data: docente,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar docente", 400);
    }
  }

  static async deleteDocente(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await AcademicStaffService.deleteDocente(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir docente", 400);
    }
  }

  // ===============================
  // DISCIPLINAS DOCENTE - CRUD
  // ===============================

  static async createDisciplinaDocente(req, res) {
    try {
      const validatedData = disciplinaDocenteCreateSchema.parse(req.body);
      const associacao = await AcademicStaffService.createDisciplinaDocente(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Associação disciplina-docente criada com sucesso",
        data: associacao,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar associação disciplina-docente", 400);
    }
  }

  static async getDisciplinasDocente(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const docenteId = req.query.docenteId || null;

      const result = await AcademicStaffService.getDisciplinasDocente(page, limit, search, docenteId);
      
      res.json({
        success: true,
        message: "Disciplinas-docente encontradas",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar disciplinas-docente", 400);
    }
  }

  static async getDisciplinaDocenteById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const associacao = await AcademicStaffService.getDisciplinaDocenteById(id);
      
      res.json({
        success: true,
        message: "Associação disciplina-docente encontrada",
        data: associacao
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar associação disciplina-docente", 400);
    }
  }

  static async updateDisciplinaDocente(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = disciplinaDocenteCreateSchema.parse(req.body);
      const associacao = await AcademicStaffService.updateDisciplinaDocente(id, validatedData);
      
      res.json({
        success: true,
        message: "Associação disciplina-docente atualizada com sucesso",
        data: associacao
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar associação disciplina-docente", 400);
    }
  }

  static async deleteDisciplinaDocente(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await AcademicStaffService.deleteDisciplinaDocente(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir associação disciplina-docente", 400);
    }
  }

  // ===============================
  // OPERAÇÕES ESPECIAIS
  // ===============================

  static async getDocentesPorEspecialidade(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const docentes = await AcademicStaffService.getDocentesPorEspecialidade(id);
      
      res.json({
        success: true,
        message: "Docentes encontrados por especialidade",
        data: docentes,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar docentes por especialidade", 400);
    }
  }

  static async getDocentesAtivos(req, res) {
    try {
      const docentes = await AcademicStaffService.getDocentesAtivos();
      
      res.json({
        success: true,
        message: "Docentes ativos encontrados",
        data: docentes,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar docentes ativos", 400);
    }
  }

  static async getRelatorioAcademico(req, res) {
    try {
      const relatorio = await AcademicStaffService.getRelatorioAcademico();
      
      res.json({
        success: true,
        message: "Relatório acadêmico gerado",
        data: relatorio,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao gerar relatório acadêmico", 400);
    }
  }

  static async getEstatisticasDisciplinasDocente(req, res) {
    try {
      const estatisticas = await AcademicStaffService.getEstatisticasDisciplinasDocente();
      
      res.json({
        success: true,
        message: "Estatísticas de disciplinas-docente geradas",
        data: estatisticas,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao gerar estatísticas de disciplinas-docente", 400);
    }
  }

  // ===============================
  // DIRETORES DE TURMAS - CRUD
  // ===============================

  static async createDiretorTurma(req, res) {
    try {
      const validatedData = diretorTurmaCreateSchema.parse(req.body);
      const diretor = await AcademicStaffService.createDiretorTurma(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Diretor de turma criado com sucesso",
        data: diretor,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar diretor de turma", 400);
    }
  }

  static async updateDiretorTurma(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = req.body; // Usar schema de update se necessário

      const diretor = await AcademicStaffService.updateDiretorTurma(id, validatedData);
      
      res.json({
        success: true,
        message: "Diretor de turma atualizado com sucesso",
        data: diretor,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar diretor de turma", 400);
    }
  }

  static async getDiretoresTurmas(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await AcademicStaffService.getDiretoresTurmas(page, limit, search);
      
      res.json({
        success: true,
        message: "Diretores de turmas encontrados",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar diretores de turmas", 400);
    }
  }

  static async getDiretorTurmaById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const diretor = await AcademicStaffService.getDiretorTurmaById(id);
      
      res.json({
        success: true,
        message: "Diretor de turma encontrado",
        data: diretor,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar diretor de turma", 400);
    }
  }

  static async deleteDiretorTurma(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await AcademicStaffService.deleteDiretorTurma(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao remover diretor de turma", 400);
    }
  }

  // ===============================
  // DOCENTE TURMA - CRUD
  // ===============================

  static async createDocenteTurma(req, res) {
    try {
      const validatedData = docenteTurmaCreateSchema.parse(req.body);
      const associacao = await AcademicStaffService.createDocenteTurma(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Associação docente-turma criada com sucesso",
        data: associacao,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar associação docente-turma", 400);
    }
  }

  static async getDocentesTurmas(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const docenteId = req.query.docenteId || null;
      const turmaId = req.query.turmaId || null;

      const result = await AcademicStaffService.getDocentesTurmas(page, limit, docenteId, turmaId);
      
      res.json({
        success: true,
        message: "Associações docente-turma encontradas",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar associações docente-turma", 400);
    }
  }

  static async deleteDocenteTurma(req, res) {
    try {
      const codigoDocente = req.params.codigoDocente;
      const codigoTurma = req.params.codigoTurma;

      const result = await AcademicStaffService.deleteDocenteTurma(codigoDocente, codigoTurma);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao remover associação docente-turma", 400);
    }
  }

  // ===============================
  // OPERAÇÕES ESPECIAIS ADICIONAIS
  // ===============================

  static async getDiretoresPorAnoLectivo(req, res) {
    try {
      const { anoLectivo } = req.params;

      const diretores = await AcademicStaffService.getDiretoresPorAnoLectivo(anoLectivo);
      
      res.json({
        success: true,
        message: "Diretores encontrados por ano letivo",
        data: diretores,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar diretores por ano letivo", 400);
    }
  }

  static async getTurmasPorDocente(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const turmas = await AcademicStaffService.getTurmasPorDocente(id);
      
      res.json({
        success: true,
        message: "Turmas encontradas por docente",
        data: turmas,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar turmas por docente", 400);
    }
  }

  static async getDocentesPorTurma(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const docentes = await AcademicStaffService.getDocentesPorTurma(id);
      
      res.json({
        success: true,
        message: "Docentes encontrados por turma",
        data: docentes,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar docentes por turma", 400);
    }
  }
}
