// controller/status-control.controller.js
import { StatusControlService } from "../services/status-control.services.js";
import { handleControllerError } from "../utils/validation.utils.js";
import {
  tipoStatusCreateSchema,
  tipoStatusUpdateSchema,
  statusCreateSchema,
  statusUpdateSchema,
  idParamSchema,
  associarStatusSchema
} from "../validations/status-control.validations.js";

export class StatusControlController {
  // ===============================
  // TIPO STATUS - CRUD COMPLETO
  // ===============================

  static async createTipoStatus(req, res) {
    try {
      const validatedData = tipoStatusCreateSchema.parse(req.body);
      const tipoStatus = await StatusControlService.createTipoStatus(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Tipo de status criado com sucesso",
        data: tipoStatus,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar tipo de status", 400);
    }
  }

  static async updateTipoStatus(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = tipoStatusUpdateSchema.parse(req.body);

      const tipoStatus = await StatusControlService.updateTipoStatus(id, validatedData);
      
      res.json({
        success: true,
        message: "Tipo de status atualizado com sucesso",
        data: tipoStatus,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar tipo de status", 400);
    }
  }

  static async getTiposStatus(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await StatusControlService.getTiposStatus(page, limit, search);
      
      res.json({
        success: true,
        message: "Tipos de status encontrados",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipos de status", 400);
    }
  }

  static async getTipoStatusById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const tipoStatus = await StatusControlService.getTipoStatusById(id);
      
      res.json({
        success: true,
        message: "Tipo de status encontrado",
        data: tipoStatus,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipo de status", 400);
    }
  }

  static async deleteTipoStatus(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await StatusControlService.deleteTipoStatus(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir tipo de status", 400);
    }
  }

  // ===============================
  // STATUS - CRUD COMPLETO
  // ===============================

  static async createStatus(req, res) {
    try {
      const validatedData = statusCreateSchema.parse(req.body);
      const status = await StatusControlService.createStatus(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Status criado com sucesso",
        data: status,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar status", 400);
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = statusUpdateSchema.parse(req.body);

      const status = await StatusControlService.updateStatus(id, validatedData);
      
      res.json({
        success: true,
        message: "Status atualizado com sucesso",
        data: status,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar status", 400);
    }
  }

  static async getStatus(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await StatusControlService.getStatus(page, limit, search);
      
      res.json({
        success: true,
        message: "Status encontrados",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar status", 400);
    }
  }

  static async getStatusById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const status = await StatusControlService.getStatusById(id);
      
      res.json({
        success: true,
        message: "Status encontrado",
        data: status,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar status", 400);
    }
  }

  static async deleteStatus(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await StatusControlService.deleteStatus(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir status", 400);
    }
  }

  // ===============================
  // OPERAÇÕES ESPECIAIS
  // ===============================

  static async getStatusByTipo(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const status = await StatusControlService.getStatusByTipo(id);
      
      res.json({
        success: true,
        message: "Status encontrados por tipo",
        data: status,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar status por tipo", 400);
    }
  }

  static async getStatusSemTipo(req, res) {
    try {
      const status = await StatusControlService.getStatusSemTipo();
      
      res.json({
        success: true,
        message: "Status sem tipo encontrados",
        data: status,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar status sem tipo", 400);
    }
  }

  static async getTiposStatusComContagem(req, res) {
    try {
      const tiposStatus = await StatusControlService.getTiposStatusComContagem();
      
      res.json({
        success: true,
        message: "Tipos de status com contagem encontrados",
        data: tiposStatus,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipos de status com contagem", 400);
    }
  }

  static async buscarStatusPorDesignacao(req, res) {
    try {
      const { designacao } = req.query;
      
      if (!designacao) {
        return res.status(400).json({
          success: false,
          message: "Parâmetro 'designacao' é obrigatório"
        });
      }

      const status = await StatusControlService.buscarStatusPorDesignacao(designacao);
      
      res.json({
        success: true,
        message: "Status encontrados por designação",
        data: status,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar status por designação", 400);
    }
  }

  static async associarStatusAoTipo(req, res) {
    try {
      const { statusId, tipoStatusId } = associarStatusSchema.parse(req.body);

      const status = await StatusControlService.associarStatusAoTipo(statusId, tipoStatusId);
      
      res.json({
        success: true,
        message: "Status associado ao tipo com sucesso",
        data: status,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao associar status ao tipo", 400);
    }
  }

  static async desassociarStatusDoTipo(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const status = await StatusControlService.desassociarStatusDoTipo(id);
      
      res.json({
        success: true,
        message: "Status desassociado do tipo com sucesso",
        data: status,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao desassociar status do tipo", 400);
    }
  }
}
