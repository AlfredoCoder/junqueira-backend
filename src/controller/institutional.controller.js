// controller/institutional.controller.js
import { InstitutionalService } from "../services/institutional.services.js";
import { handleControllerError } from "../utils/validation.utils.js";

export class InstitutionalController {
  // ===============================
  // PROFISSÕES
  // ===============================

  static async getAllProfissoes(req, res) {
    try {
      const profissoes = await InstitutionalService.getAllProfissoes();
      
      res.json({
        success: true,
        message: "Profissões obtidas com sucesso",
        data: profissoes,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter profissões", 500);
    }
  }

  static async getProfissaoById(req, res) {
    try {
      const { id } = req.params;
      const profissao = await InstitutionalService.getProfissaoById(id);
      
      res.json({
        success: true,
        message: "Profissão obtida com sucesso",
        data: profissao,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter profissão", 404);
    }
  }

  // ===============================
  // TIPOS DE DOCUMENTO
  // ===============================

  static async getAllTiposDocumento(req, res) {
    try {
      const tiposDocumento = await InstitutionalService.getAllTiposDocumento();
      
      res.json({
        success: true,
        message: "Tipos de documento obtidos com sucesso",
        data: tiposDocumento,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter tipos de documento", 500);
    }
  }

  static async getTipoDocumentoById(req, res) {
    try {
      const { id } = req.params;
      const tipoDocumento = await InstitutionalService.getTipoDocumentoById(id);
      
      res.json({
        success: true,
        message: "Tipo de documento obtido com sucesso",
        data: tipoDocumento,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter tipo de documento", 404);
    }
  }

  // ===============================
  // REGIME IVA
  // ===============================

  static async getAllRegimesIva(req, res) {
    try {
      const regimesIva = await InstitutionalService.getAllRegimesIva();
      
      res.json({
        success: true,
        message: "Regimes de IVA obtidos com sucesso",
        data: regimesIva,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter regimes de IVA", 500);
    }
  }

  static async getRegimeIvaById(req, res) {
    try {
      const { id } = req.params;
      const regimeIva = await InstitutionalService.getRegimeIvaById(id);
      
      res.json({
        success: true,
        message: "Regime de IVA obtido com sucesso",
        data: regimeIva,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter regime de IVA", 404);
    }
  }

  // ===============================
  // DADOS DA INSTITUIÇÃO
  // ===============================

  static async getAllDadosInstituicao(req, res) {
    try {
      const dadosInstituicao = await InstitutionalService.getAllDadosInstituicao();
      
      res.json({
        success: true,
        message: "Dados da instituição obtidos com sucesso",
        data: dadosInstituicao,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter dados da instituição", 500);
    }
  }

  static async getDadosInstituicaoById(req, res) {
    try {
      const { id } = req.params;
      const dadosInstituicao = await InstitutionalService.getDadosInstituicaoById(id);
      
      res.json({
        success: true,
        message: "Dados da instituição obtidos com sucesso",
        data: dadosInstituicao,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter dados da instituição", 404);
    }
  }

  static async getDadosInstituicaoPrincipal(req, res) {
    try {
      const dadosInstituicao = await InstitutionalService.getDadosInstituicaoPrincipal();
      
      res.json({
        success: true,
        message: "Dados principais da instituição obtidos com sucesso",
        data: dadosInstituicao,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter dados principais da instituição", 404);
    }
  }

  // ===============================
  // PARÂMETROS
  // ===============================

  static async getAllParametros(req, res) {
    try {
      const parametros = await InstitutionalService.getAllParametros();
      
      res.json({
        success: true,
        message: "Parâmetros obtidos com sucesso",
        data: parametros,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter parâmetros", 500);
    }
  }

  static async getParametroById(req, res) {
    try {
      const { id } = req.params;
      const parametro = await InstitutionalService.getParametroById(id);
      
      res.json({
        success: true,
        message: "Parâmetro obtido com sucesso",
        data: parametro,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter parâmetro", 404);
    }
  }

  static async getParametroByDescricao(req, res) {
    try {
      const { descricao } = req.params;
      const parametro = await InstitutionalService.getParametroByDescricao(descricao);
      
      res.json({
        success: true,
        message: "Parâmetro obtido com sucesso",
        data: parametro,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter parâmetro", 404);
    }
  }

  // ===============================
  // STATUS ESCOLA
  // ===============================

  static async getAllStatusEscola(req, res) {
    try {
      const statusEscola = await InstitutionalService.getAllStatusEscola();
      
      res.json({
        success: true,
        message: "Status da escola obtidos com sucesso",
        data: statusEscola,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter status da escola", 500);
    }
  }

  static async getStatusEscolaById(req, res) {
    try {
      const { id } = req.params;
      const statusEscola = await InstitutionalService.getStatusEscolaById(id);
      
      res.json({
        success: true,
        message: "Status da escola obtido com sucesso",
        data: statusEscola,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter status da escola", 404);
    }
  }

  // ===============================
  // NUMERAÇÃO DE DOCUMENTOS
  // ===============================

  static async getAllNumeracaoDocumentos(req, res) {
    try {
      const numeracaoDocumentos = await InstitutionalService.getAllNumeracaoDocumentos();
      
      res.json({
        success: true,
        message: "Numeração de documentos obtida com sucesso",
        data: numeracaoDocumentos,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter numeração de documentos", 500);
    }
  }

  static async getNumeracaoDocumentoById(req, res) {
    try {
      const { id } = req.params;
      const numeracaoDocumento = await InstitutionalService.getNumeracaoDocumentoById(id);
      
      res.json({
        success: true,
        message: "Numeração de documento obtida com sucesso",
        data: numeracaoDocumento,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter numeração de documento", 404);
    }
  }

  // ===============================
  // ITENS GUIA
  // ===============================

  static async getAllItensGuia(req, res) {
    try {
      const itensGuia = await InstitutionalService.getAllItensGuia();
      
      res.json({
        success: true,
        message: "Itens da guia obtidos com sucesso",
        data: itensGuia,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter itens da guia", 500);
    }
  }

  static async getItemGuiaById(req, res) {
    try {
      const { id } = req.params;
      const itemGuia = await InstitutionalService.getItemGuiaById(id);
      
      res.json({
        success: true,
        message: "Item da guia obtido com sucesso",
        data: itemGuia,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter item da guia", 404);
    }
  }

  // ===============================
  // OPERAÇÕES ESPECIAIS
  // ===============================

  static async getInstitutionalData(req, res) {
    try {
      const institutionalData = await InstitutionalService.getInstitutionalData();
      
      res.json({
        success: true,
        message: "Dados institucionais obtidos com sucesso",
        data: institutionalData,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter dados institucionais", 500);
    }
  }

  static async searchInstitutional(req, res) {
    try {
      const { q: searchTerm } = req.query;
      
      if (!searchTerm || searchTerm.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Termo de busca deve ter pelo menos 2 caracteres",
        });
      }

      const results = await InstitutionalService.searchInstitutional(searchTerm.trim());
      
      res.json({
        success: true,
        message: "Busca institucional realizada com sucesso",
        data: results,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao realizar busca institucional", 500);
    }
  }
}
