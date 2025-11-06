// controller/financial-services.controller.js
import { FinancialServicesService } from "../services/financial-services.services.js";
import { handleControllerError } from "../utils/validation.utils.js";
import {
  moedaCreateSchema,
  moedaUpdateSchema,
  categoriaServicoCreateSchema,
  categoriaServicoUpdateSchema,
  tipoServicoCreateSchema,
  tipoServicoUpdateSchema,
  motivoIvaCreateSchema,
  motivoIvaUpdateSchema,
  taxaIvaCreateSchema,
  taxaIvaUpdateSchema,
  tipoMultaCreateSchema,
  tipoMultaUpdateSchema,
  motivoIsencaoCreateSchema,
  motivoIsencaoUpdateSchema,
  tipoTaxaIvaCreateSchema,
  tipoTaxaIvaUpdateSchema,
  idParamSchema
} from "../validations/financial-services.validations.js";

export class FinancialServicesController {
  // ===============================
  // MOEDAS - CRUD COMPLETO
  // ===============================

  static async createMoeda(req, res) {
    try {
      const validatedData = moedaCreateSchema.parse(req.body);
      const moeda = await FinancialServicesService.createMoeda(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Moeda criada com sucesso",
        data: moeda,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar moeda", 400);
    }
  }

  static async updateMoeda(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = moedaUpdateSchema.parse(req.body);

      const moeda = await FinancialServicesService.updateMoeda(id, validatedData);
      
      res.json({
        success: true,
        message: "Moeda atualizada com sucesso",
        data: moeda,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar moeda", 400);
    }
  }

  static async getMoedas(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await FinancialServicesService.getMoedas(page, limit, search);
      
      res.json({
        success: true,
        message: "Moedas encontradas",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar moedas", 400);
    }
  }

  static async getMoedaById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const moeda = await FinancialServicesService.getMoedaById(id);
      
      res.json({
        success: true,
        message: "Moeda encontrada",
        data: moeda,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar moeda", 400);
    }
  }

  static async deleteMoeda(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await FinancialServicesService.deleteMoeda(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir moeda", 400);
    }
  }

  // ===============================
  // CATEGORIAS DE SERVIÇOS - CRUD COMPLETO
  // ===============================

  static async createCategoriaServico(req, res) {
    try {
      const validatedData = categoriaServicoCreateSchema.parse(req.body);
      const categoria = await FinancialServicesService.createCategoriaServico(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Categoria de serviço criada com sucesso",
        data: categoria,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar categoria de serviço", 400);
    }
  }

  static async updateCategoriaServico(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = categoriaServicoUpdateSchema.parse(req.body);

      const categoria = await FinancialServicesService.updateCategoriaServico(id, validatedData);
      
      res.json({
        success: true,
        message: "Categoria de serviço atualizada com sucesso",
        data: categoria,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar categoria de serviço", 400);
    }
  }

  static async getCategoriasServicos(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await FinancialServicesService.getCategoriasServicos(page, limit, search);
      
      res.json({
        success: true,
        message: "Categorias de serviços encontradas",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar categorias de serviços", 400);
    }
  }

  static async getCategoriaServicoById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const categoria = await FinancialServicesService.getCategoriaServicoById(id);
      
      res.json({
        success: true,
        message: "Categoria de serviço encontrada",
        data: categoria,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar categoria de serviço", 400);
    }
  }

  static async deleteCategoriaServico(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await FinancialServicesService.deleteCategoriaServico(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir categoria de serviço", 400);
    }
  }

  // ===============================
  // TIPOS DE SERVIÇOS - CRUD COMPLETO
  // ===============================

  static async createTipoServico(req, res) {
    try {
      const validatedData = tipoServicoCreateSchema.parse(req.body);
      const tipoServico = await FinancialServicesService.createTipoServico(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Tipo de serviço criado com sucesso",
        data: tipoServico,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar tipo de serviço", 400);
    }
  }

  static async updateTipoServico(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = tipoServicoUpdateSchema.parse(req.body);

      const tipoServico = await FinancialServicesService.updateTipoServico(id, validatedData);
      
      res.json({
        success: true,
        message: "Tipo de serviço atualizado com sucesso",
        data: tipoServico,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar tipo de serviço", 400);
    }
  }

  static async getTiposServicos(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await FinancialServicesService.getTiposServicos(page, limit, search);
      
      res.json({
        success: true,
        message: "Tipos de serviços encontrados",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipos de serviços", 400);
    }
  }

  static async getTipoServicoById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const tipoServico = await FinancialServicesService.getTipoServicoById(id);
      
      res.json({
        success: true,
        message: "Tipo de serviço encontrado",
        data: tipoServico,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipo de serviço", 400);
    }
  }

  static async deleteTipoServico(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await FinancialServicesService.deleteTipoServico(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir tipo de serviço", 400);
    }
  }

  // ===============================
  // OPERAÇÕES ESPECIAIS
  // ===============================

  static async getTiposServicosPorCategoria(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const tiposServicos = await FinancialServicesService.getTiposServicosPorCategoria(id);
      
      res.json({
        success: true,
        message: "Tipos de serviços encontrados por categoria",
        data: tiposServicos,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipos de serviços por categoria", 400);
    }
  }

  static async getTiposServicosPorMoeda(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const tiposServicos = await FinancialServicesService.getTiposServicosPorMoeda(id);
      
      res.json({
        success: true,
        message: "Tipos de serviços encontrados por moeda",
        data: tiposServicos,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipos de serviços por moeda", 400);
    }
  }

  static async getTiposServicosAtivos(req, res) {
    try {
      const tiposServicos = await FinancialServicesService.getTiposServicosAtivos();
      
      res.json({
        success: true,
        message: "Tipos de serviços ativos encontrados",
        data: tiposServicos,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipos de serviços ativos", 400);
    }
  }

  static async getTiposServicosComMulta(req, res) {
    try {
      const tiposServicos = await FinancialServicesService.getTiposServicosComMulta();
      
      res.json({
        success: true,
        message: "Tipos de serviços com multa encontrados",
        data: tiposServicos,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipos de serviços com multa", 400);
    }
  }

  static async getRelatorioFinanceiro(req, res) {
    try {
      const relatorio = await FinancialServicesService.getRelatorioFinanceiro();
      
      res.json({
        success: true,
        message: "Relatório financeiro gerado",
        data: relatorio,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao gerar relatório financeiro", 400);
    }
  }

  static async getRelatorioVendas(req, res) {
    try {
      const filters = req.query;
      const relatorio = await FinancialServicesService.getRelatorioVendas(filters);
      
      res.json({
        success: true,
        message: "Relatório de vendas gerado",
        data: relatorio,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao gerar relatório de vendas", 400);
    }
  }

  static async getRelatorioVendasFuncionarios(req, res) {
    try {
      const filters = req.query;
      const relatorio = await FinancialServicesService.getRelatorioVendasFuncionarios(filters);
      
      res.json({
        success: true,
        message: "Relatório de vendas por funcionários gerado",
        data: relatorio,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao gerar relatório de vendas por funcionários", 400);
    }
  }

  // ===============================
  // MOTIVOS IVA - CRUD COMPLETO
  // ===============================

  static async createMotivoIva(req, res) {
    try {
      const validatedData = motivoIvaCreateSchema.parse(req.body);
      const motivo = await FinancialServicesService.createMotivoIva(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Motivo IVA criado com sucesso",
        data: motivo,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar motivo IVA", 400);
    }
  }

  static async updateMotivoIva(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = motivoIvaUpdateSchema.parse(req.body);

      const motivo = await FinancialServicesService.updateMotivoIva(id, validatedData);
      
      res.json({
        success: true,
        message: "Motivo IVA atualizado com sucesso",
        data: motivo,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar motivo IVA", 400);
    }
  }

  static async getMotivosIva(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await FinancialServicesService.getMotivosIva(page, limit, search);
      
      res.json({
        success: true,
        message: "Motivos IVA encontrados",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar motivos IVA", 400);
    }
  }

  static async getMotivoIvaById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const motivo = await FinancialServicesService.getMotivoIvaById(id);
      
      res.json({
        success: true,
        message: "Motivo IVA encontrado",
        data: motivo,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar motivo IVA", 400);
    }
  }

  static async deleteMotivoIva(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await FinancialServicesService.deleteMotivoIva(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir motivo IVA", 400);
    }
  }

  // ===============================
  // TAXAS IVA - CRUD COMPLETO
  // ===============================

  static async createTaxaIva(req, res) {
    try {
      const validatedData = taxaIvaCreateSchema.parse(req.body);
      const taxa = await FinancialServicesService.createTaxaIva(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Taxa IVA criada com sucesso",
        data: taxa,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar taxa IVA", 400);
    }
  }

  static async updateTaxaIva(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = taxaIvaUpdateSchema.parse(req.body);

      const taxa = await FinancialServicesService.updateTaxaIva(id, validatedData);
      
      res.json({
        success: true,
        message: "Taxa IVA atualizada com sucesso",
        data: taxa,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar taxa IVA", 400);
    }
  }

  static async getTaxasIva(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await FinancialServicesService.getTaxasIva(page, limit, search);
      
      res.json({
        success: true,
        message: "Taxas IVA encontradas",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar taxas IVA", 400);
    }
  }

  static async getTaxaIvaById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const taxa = await FinancialServicesService.getTaxaIvaById(id);
      
      res.json({
        success: true,
        message: "Taxa IVA encontrada",
        data: taxa,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar taxa IVA", 400);
    }
  }

  static async deleteTaxaIva(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await FinancialServicesService.deleteTaxaIva(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir taxa IVA", 400);
    }
  }

  // ===============================
  // TIPOS DE MULTA - CRUD COMPLETO
  // ===============================

  static async createTipoMulta(req, res) {
    try {
      const validatedData = tipoMultaCreateSchema.parse(req.body);
      const tipo = await FinancialServicesService.createTipoMulta(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Tipo de multa criado com sucesso",
        data: tipo,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar tipo de multa", 400);
    }
  }

  static async updateTipoMulta(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = tipoMultaUpdateSchema.parse(req.body);

      const tipo = await FinancialServicesService.updateTipoMulta(id, validatedData);
      
      res.json({
        success: true,
        message: "Tipo de multa atualizado com sucesso",
        data: tipo,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar tipo de multa", 400);
    }
  }

  static async getTiposMulta(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await FinancialServicesService.getTiposMulta(page, limit, search);
      
      res.json({
        success: true,
        message: "Tipos de multa encontrados",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipos de multa", 400);
    }
  }

  static async getTipoMultaById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const tipo = await FinancialServicesService.getTipoMultaById(id);
      
      res.json({
        success: true,
        message: "Tipo de multa encontrado",
        data: tipo,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipo de multa", 400);
    }
  }

  static async deleteTipoMulta(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await FinancialServicesService.deleteTipoMulta(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir tipo de multa", 400);
    }
  }

  // ===============================
  // MOTIVOS DE ISENÇÃO - CRUD COMPLETO
  // ===============================

  static async createMotivoIsencao(req, res) {
    try {
      const validatedData = motivoIsencaoCreateSchema.parse(req.body);
      const motivo = await FinancialServicesService.createMotivoIsencao(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Motivo de isenção criado com sucesso",
        data: motivo,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar motivo de isenção", 400);
    }
  }

  static async updateMotivoIsencao(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = motivoIsencaoUpdateSchema.parse(req.body);

      const motivo = await FinancialServicesService.updateMotivoIsencao(id, validatedData);
      
      res.json({
        success: true,
        message: "Motivo de isenção atualizado com sucesso",
        data: motivo,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar motivo de isenção", 400);
    }
  }

  static async getMotivosIsencao(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await FinancialServicesService.getMotivosIsencao(page, limit, search);
      
      res.json({
        success: true,
        message: "Motivos de isenção encontrados",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar motivos de isenção", 400);
    }
  }

  static async getMotivoIsencaoById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const motivo = await FinancialServicesService.getMotivoIsencaoById(id);
      
      res.json({
        success: true,
        message: "Motivo de isenção encontrado",
        data: motivo,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar motivo de isenção", 400);
    }
  }

  static async deleteMotivoIsencao(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await FinancialServicesService.deleteMotivoIsencao(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir motivo de isenção", 400);
    }
  }

  // ===============================
  // TIPOS DE TAXA IVA - CRUD COMPLETO
  // ===============================

  static async createTipoTaxaIva(req, res) {
    try {
      const validatedData = tipoTaxaIvaCreateSchema.parse(req.body);
      const tipo = await FinancialServicesService.createTipoTaxaIva(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Tipo de taxa IVA criado com sucesso",
        data: tipo,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar tipo de taxa IVA", 400);
    }
  }

  static async updateTipoTaxaIva(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = tipoTaxaIvaUpdateSchema.parse(req.body);

      const tipo = await FinancialServicesService.updateTipoTaxaIva(id, validatedData);
      
      res.json({
        success: true,
        message: "Tipo de taxa IVA atualizado com sucesso",
        data: tipo,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar tipo de taxa IVA", 400);
    }
  }

  static async getTiposTaxaIva(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await FinancialServicesService.getTiposTaxaIva(page, limit, search);
      
      res.json({
        success: true,
        message: "Tipos de taxa IVA encontrados",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipos de taxa IVA", 400);
    }
  }

  static async getTipoTaxaIvaById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const tipo = await FinancialServicesService.getTipoTaxaIvaById(id);
      
      res.json({
        success: true,
        message: "Tipo de taxa IVA encontrado",
        data: tipo,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar tipo de taxa IVA", 400);
    }
  }

  static async deleteTipoTaxaIva(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await FinancialServicesService.deleteTipoTaxaIva(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir tipo de taxa IVA", 400);
    }
  }
}
