// controller/institutional-management.controller.js
import { InstitutionalManagementService } from "../services/institutional-management.services.js";
import { handleControllerError } from "../utils/validation.utils.js";
import {
  regimeIvaCreateSchema,
  regimeIvaUpdateSchema,
  regimeIvaFlexibleCreateSchema,
  dadosInstituicaoCreateSchema,
  dadosInstituicaoUpdateSchema,
  dadosInstituicaoFlexibleCreateSchema,
  parametroCreateSchema,
  parametroUpdateSchema,
  parametroFlexibleCreateSchema,
  statusEscolaCreateSchema,
  statusEscolaUpdateSchema,
  numeracaoDocumentoCreateSchema,
  numeracaoDocumentoUpdateSchema,
  itemGuiaCreateSchema,
  itemGuiaUpdateSchema,
  idParamSchema,
  nextNumberSchema
} from "../validations/institutional-management.validations.js";

export class InstitutionalManagementController {
  // ===============================
  // REGIME IVA - CRUD COMPLETO
  // ===============================

  static async createRegimeIva(req, res) {
    try {
      // Tentar primeiro o schema flexível, depois o padrão
      let validatedData;
      try {
        validatedData = regimeIvaFlexibleCreateSchema.parse(req.body);
      } catch {
        validatedData = regimeIvaCreateSchema.parse(req.body);
      }

      const regimeIva = await InstitutionalManagementService.createRegimeIva(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Regime de IVA criado com sucesso",
        data: regimeIva,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar regime de IVA", 400);
    }
  }

  static async updateRegimeIva(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = regimeIvaUpdateSchema.parse(req.body);

      const regimeIva = await InstitutionalManagementService.updateRegimeIva(id, validatedData);
      
      res.json({
        success: true,
        message: "Regime de IVA atualizado com sucesso",
        data: regimeIva,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar regime de IVA", 400);
    }
  }

  static async deleteRegimeIva(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await InstitutionalManagementService.deleteRegimeIva(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir regime de IVA", 400);
    }
  }

  // ===============================
  // DADOS INSTITUIÇÃO - CRUD COMPLETO
  // ===============================

  static async createDadosInstituicao(req, res) {
    try {
      // Tentar primeiro o schema flexível, depois o padrão
      let validatedData;
      try {
        validatedData = dadosInstituicaoFlexibleCreateSchema.parse(req.body);
      } catch {
        validatedData = dadosInstituicaoCreateSchema.parse(req.body);
      }

      const dadosInstituicao = await InstitutionalManagementService.createDadosInstituicao(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Dados da instituição criados com sucesso",
        data: dadosInstituicao,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar dados da instituição", 400);
    }
  }

  static async updateDadosInstituicao(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = dadosInstituicaoUpdateSchema.parse(req.body);

      const dadosInstituicao = await InstitutionalManagementService.updateDadosInstituicao(id, validatedData);
      
      res.json({
        success: true,
        message: "Dados da instituição atualizados com sucesso",
        data: dadosInstituicao,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar dados da instituição", 400);
    }
  }

  static async deleteDadosInstituicao(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await InstitutionalManagementService.deleteDadosInstituicao(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir dados da instituição", 400);
    }
  }

  // ===============================
  // PARÂMETROS - CRUD COMPLETO
  // ===============================

  static async createParametro(req, res) {
    try {
      // Tentar primeiro o schema flexível, depois o padrão
      let validatedData;
      try {
        validatedData = parametroFlexibleCreateSchema.parse(req.body);
      } catch {
        validatedData = parametroCreateSchema.parse(req.body);
      }

      const parametro = await InstitutionalManagementService.createParametro(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Parâmetro criado com sucesso",
        data: parametro,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar parâmetro", 400);
    }
  }

  static async updateParametro(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = parametroUpdateSchema.parse(req.body);

      const parametro = await InstitutionalManagementService.updateParametro(id, validatedData);
      
      res.json({
        success: true,
        message: "Parâmetro atualizado com sucesso",
        data: parametro,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar parâmetro", 400);
    }
  }

  static async deleteParametro(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await InstitutionalManagementService.deleteParametro(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir parâmetro", 400);
    }
  }

  // ===============================
  // STATUS ESCOLA - CRUD COMPLETO
  // ===============================

  static async createStatusEscola(req, res) {
    try {
      const validatedData = statusEscolaCreateSchema.parse(req.body);

      const statusEscola = await InstitutionalManagementService.createStatusEscola(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Status da escola criado com sucesso",
        data: statusEscola,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar status da escola", 400);
    }
  }

  static async updateStatusEscola(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = statusEscolaUpdateSchema.parse(req.body);

      const statusEscola = await InstitutionalManagementService.updateStatusEscola(id, validatedData);
      
      res.json({
        success: true,
        message: "Status da escola atualizado com sucesso",
        data: statusEscola,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar status da escola", 400);
    }
  }

  static async deleteStatusEscola(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await InstitutionalManagementService.deleteStatusEscola(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir status da escola", 400);
    }
  }

  // ===============================
  // NUMERAÇÃO DOCUMENTOS - CRUD COMPLETO
  // ===============================

  static async createNumeracaoDocumento(req, res) {
    try {
      const validatedData = numeracaoDocumentoCreateSchema.parse(req.body);

      const numeracaoDocumento = await InstitutionalManagementService.createNumeracaoDocumento(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Numeração de documento criada com sucesso",
        data: numeracaoDocumento,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar numeração de documento", 400);
    }
  }

  static async updateNumeracaoDocumento(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = numeracaoDocumentoUpdateSchema.parse(req.body);

      const numeracaoDocumento = await InstitutionalManagementService.updateNumeracaoDocumento(id, validatedData);
      
      res.json({
        success: true,
        message: "Numeração de documento atualizada com sucesso",
        data: numeracaoDocumento,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar numeração de documento", 400);
    }
  }

  static async deleteNumeracaoDocumento(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await InstitutionalManagementService.deleteNumeracaoDocumento(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir numeração de documento", 400);
    }
  }

  // ===============================
  // ITENS GUIA - CRUD COMPLETO
  // ===============================

  static async createItemGuia(req, res) {
    try {
      const validatedData = itemGuiaCreateSchema.parse(req.body);

      const itemGuia = await InstitutionalManagementService.createItemGuia(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Item da guia criado com sucesso",
        data: itemGuia,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar item da guia", 400);
    }
  }

  static async updateItemGuia(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = itemGuiaUpdateSchema.parse(req.body);

      const itemGuia = await InstitutionalManagementService.updateItemGuia(id, validatedData);
      
      res.json({
        success: true,
        message: "Item da guia atualizado com sucesso",
        data: itemGuia,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar item da guia", 400);
    }
  }

  static async deleteItemGuia(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await InstitutionalManagementService.deleteItemGuia(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir item da guia", 400);
    }
  }

  // ===============================
  // OPERAÇÕES ESPECIAIS
  // ===============================

  static async getNextDocumentNumber(req, res) {
    try {
      const { designacao } = nextNumberSchema.parse(req.params);

      const result = await InstitutionalManagementService.getNextDocumentNumber(designacao);
      
      res.json({
        success: true,
        message: "Próximo número do documento obtido com sucesso",
        data: result,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter próximo número do documento", 400);
    }
  }

  // Método para obter próximo número via query parameter
  static async getNextDocumentNumberByQuery(req, res) {
    try {
      const { designacao } = req.query;
      
      if (!designacao) {
        return res.status(400).json({
          success: false,
          message: "Parâmetro 'designacao' é obrigatório",
        });
      }

      const validatedData = nextNumberSchema.parse({ designacao });
      const result = await InstitutionalManagementService.getNextDocumentNumber(validatedData.designacao);
      
      res.json({
        success: true,
        message: "Próximo número do documento obtido com sucesso",
        data: result,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter próximo número do documento", 400);
    }
  }

  // ===============================
  // OPERAÇÕES DE LOTE (BATCH)
  // ===============================

  static async createMultipleParametros(req, res) {
    try {
      const { parametros } = req.body;
      
      if (!Array.isArray(parametros) || parametros.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Lista de parâmetros é obrigatória e deve conter pelo menos um item",
        });
      }

      const results = [];
      const errors = [];

      for (let i = 0; i < parametros.length; i++) {
        try {
          let validatedData;
          try {
            validatedData = parametroFlexibleCreateSchema.parse(parametros[i]);
          } catch {
            validatedData = parametroCreateSchema.parse(parametros[i]);
          }

          const parametro = await InstitutionalManagementService.createParametro(validatedData);
          results.push({ index: i, success: true, data: parametro });
        } catch (error) {
          errors.push({ 
            index: i, 
            success: false, 
            error: error.message,
            data: parametros[i]
          });
        }
      }
      
      res.status(201).json({
        success: true,
        message: `Processamento concluído. ${results.length} parâmetros criados, ${errors.length} erros`,
        data: {
          created: results,
          errors: errors,
          summary: {
            total: parametros.length,
            success: results.length,
            failed: errors.length
          }
        },
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar múltiplos parâmetros", 400);
    }
  }

  static async createMultipleItensGuia(req, res) {
    try {
      const { itens } = req.body;
      
      if (!Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Lista de itens é obrigatória e deve conter pelo menos um item",
        });
      }

      const results = [];
      const errors = [];

      for (let i = 0; i < itens.length; i++) {
        try {
          const validatedData = itemGuiaCreateSchema.parse(itens[i]);
          const item = await InstitutionalManagementService.createItemGuia(validatedData);
          results.push({ index: i, success: true, data: item });
        } catch (error) {
          errors.push({ 
            index: i, 
            success: false, 
            error: error.message,
            data: itens[i]
          });
        }
      }
      
      res.status(201).json({
        success: true,
        message: `Processamento concluído. ${results.length} itens criados, ${errors.length} erros`,
        data: {
          created: results,
          errors: errors,
          summary: {
            total: itens.length,
            success: results.length,
            failed: errors.length
          }
        },
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar múltiplos itens da guia", 400);
    }
  }
}
