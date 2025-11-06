// controller/academic-evaluation.controller.js
import { AcademicEvaluationService } from "../services/academic-evaluation.services.js";
import { handleControllerError } from "../utils/validation.utils.js";
import { idParamSchema } from "../validations/academic-evaluation.validations.js";

export class AcademicEvaluationController {
  // ===============================
  // TIPOS DE AVALIAÇÃO - CONSULTAS
  // ===============================

  static async getTiposAvaliacao(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await AcademicEvaluationService.getTiposAvaliacao(page, limit, search);
      
      res.json({
        success: true,
        message: "Tipos de avaliação encontrados",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipos de avaliação", 400);
    }
  }

  static async getTipoAvaliacaoById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const tipoAvaliacao = await AcademicEvaluationService.getTipoAvaliacaoById(id);
      
      res.json({
        success: true,
        message: "Tipo de avaliação encontrado",
        data: tipoAvaliacao,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipo de avaliação", 400);
    }
  }

  static async getTiposAvaliacaoPorTipo(req, res) {
    try {
      const { tipoAvaliacao } = req.params;

      const tipos = await AcademicEvaluationService.getTiposAvaliacaoPorTipo(tipoAvaliacao);
      
      res.json({
        success: true,
        message: "Tipos de avaliação encontrados por tipo",
        data: tipos,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipos de avaliação por tipo", 400);
    }
  }

  // ===============================
  // TIPOS DE NOTA - CONSULTAS
  // ===============================

  static async getTiposNota(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await AcademicEvaluationService.getTiposNota(page, limit, search);
      
      res.json({
        success: true,
        message: "Tipos de nota encontrados",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipos de nota", 400);
    }
  }

  static async getTipoNotaById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const tipoNota = await AcademicEvaluationService.getTipoNotaById(id);
      
      res.json({
        success: true,
        message: "Tipo de nota encontrado",
        data: tipoNota,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipo de nota", 400);
    }
  }

  static async getTiposNotaAtivos(req, res) {
    try {
      const tipos = await AcademicEvaluationService.getTiposNotaAtivos();
      
      res.json({
        success: true,
        message: "Tipos de nota ativos encontrados",
        data: tipos,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipos de nota ativos", 400);
    }
  }

  // ===============================
  // TIPOS DE NOTA VALOR - CONSULTAS
  // ===============================

  static async getTiposNotaValor(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const tipoNotaId = req.query.tipoNotaId || null;

      const result = await AcademicEvaluationService.getTiposNotaValor(page, limit, tipoNotaId);
      
      res.json({
        success: true,
        message: "Tipos de nota valor encontrados",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipos de nota valor", 400);
    }
  }

  static async getTipoNotaValorById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const tipoNotaValor = await AcademicEvaluationService.getTipoNotaValorById(id);
      
      res.json({
        success: true,
        message: "Tipo de nota valor encontrado",
        data: tipoNotaValor,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipo de nota valor", 400);
    }
  }

  static async getValoresPorTipoNota(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const valores = await AcademicEvaluationService.getValoresPorTipoNota(id);
      
      res.json({
        success: true,
        message: "Valores encontrados por tipo de nota",
        data: valores,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar valores por tipo de nota", 400);
    }
  }

  // ===============================
  // TIPOS DE PAUTA - CONSULTAS
  // ===============================

  static async getTiposPauta(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await AcademicEvaluationService.getTiposPauta(page, limit, search);
      
      res.json({
        success: true,
        message: "Tipos de pauta encontrados",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipos de pauta", 400);
    }
  }

  static async getTipoPautaById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const tipoPauta = await AcademicEvaluationService.getTipoPautaById(id);
      
      res.json({
        success: true,
        message: "Tipo de pauta encontrado",
        data: tipoPauta,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipo de pauta", 400);
    }
  }

  // ===============================
  // TRIMESTRES - CONSULTAS
  // ===============================

  static async getTrimestres(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await AcademicEvaluationService.getTrimestres(page, limit, search);
      
      res.json({
        success: true,
        message: "Trimestres encontrados",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar trimestres", 400);
    }
  }

  static async getTrimestreById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const trimestre = await AcademicEvaluationService.getTrimestreById(id);
      
      res.json({
        success: true,
        message: "Trimestre encontrado",
        data: trimestre,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar trimestre", 400);
    }
  }

  // ===============================
  // RELATÓRIOS E ESTATÍSTICAS
  // ===============================

  static async getRelatorioAvaliacao(req, res) {
    try {
      const relatorio = await AcademicEvaluationService.getRelatorioAvaliacao();
      
      res.json({
        success: true,
        message: "Relatório de avaliação gerado",
        data: relatorio,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao gerar relatório de avaliação", 400);
    }
  }

  static async getEstatisticasNotas(req, res) {
    try {
      const estatisticas = await AcademicEvaluationService.getEstatisticasNotas();
      
      res.json({
        success: true,
        message: "Estatísticas de notas geradas",
        data: estatisticas,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao gerar estatísticas de notas", 400);
    }
  }
}
