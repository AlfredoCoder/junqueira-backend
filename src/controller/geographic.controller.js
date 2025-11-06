// controller/geographic.controller.js
import { GeographicService } from "../services/geographic.services.js";
import { handleControllerError } from "../utils/validation.utils.js";

export class GeographicController {
  // ===============================
  // NACIONALIDADES
  // ===============================

  static async getAllNacionalidades(req, res) {
    try {
      const nacionalidades = await GeographicService.getAllNacionalidades();
      
      res.json({
        success: true,
        message: "Nacionalidades obtidas com sucesso",
        data: nacionalidades,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter nacionalidades", 500);
    }
  }

  static async getNacionalidadeById(req, res) {
    try {
      const { id } = req.params;
      const nacionalidade = await GeographicService.getNacionalidadeById(id);
      
      res.json({
        success: true,
        message: "Nacionalidade obtida com sucesso",
        data: nacionalidade,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter nacionalidade", 404);
    }
  }

  // ===============================
  // ESTADO CIVIL
  // ===============================

  static async getAllEstadoCivil(req, res) {
    try {
      const estadosCivis = await GeographicService.getAllEstadoCivil();
      
      res.json({
        success: true,
        message: "Estados civis obtidos com sucesso",
        data: estadosCivis,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter estados civis", 500);
    }
  }

  static async getEstadoCivilById(req, res) {
    try {
      const { id } = req.params;
      const estadoCivil = await GeographicService.getEstadoCivilById(id);
      
      res.json({
        success: true,
        message: "Estado civil obtido com sucesso",
        data: estadoCivil,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter estado civil", 404);
    }
  }

  // ===============================
  // PROVÍNCIAS
  // ===============================

  static async getAllProvincias(req, res) {
    try {
      const provincias = await GeographicService.getAllProvincias();
      
      res.json({
        success: true,
        message: "Províncias obtidas com sucesso",
        data: provincias,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter províncias", 500);
    }
  }

  static async getProvinciaById(req, res) {
    try {
      const { id } = req.params;
      const provincia = await GeographicService.getProvinciaById(id);
      
      res.json({
        success: true,
        message: "Província obtida com sucesso",
        data: provincia,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter província", 404);
    }
  }

  // ===============================
  // MUNICÍPIOS
  // ===============================

  static async getAllMunicipios(req, res) {
    try {
      const municipios = await GeographicService.getAllMunicipios();
      
      res.json({
        success: true,
        message: "Municípios obtidos com sucesso",
        data: municipios,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter municípios", 500);
    }
  }

  static async getMunicipioById(req, res) {
    try {
      const { id } = req.params;
      const municipio = await GeographicService.getMunicipioById(id);
      
      res.json({
        success: true,
        message: "Município obtido com sucesso",
        data: municipio,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter município", 404);
    }
  }

  static async getMunicipiosByProvincia(req, res) {
    try {
      const { provinciaId } = req.params;
      const municipios = await GeographicService.getMunicipiosByProvincia(provinciaId);
      
      res.json({
        success: true,
        message: "Municípios da província obtidos com sucesso",
        data: municipios,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter municípios da província", 500);
    }
  }

  // ===============================
  // COMUNAS
  // ===============================

  static async getAllComunas(req, res) {
    try {
      const comunas = await GeographicService.getAllComunas();
      
      res.json({
        success: true,
        message: "Comunas obtidas com sucesso",
        data: comunas,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter comunas", 500);
    }
  }

  static async getComunaById(req, res) {
    try {
      const { id } = req.params;
      const comuna = await GeographicService.getComunaById(id);
      
      res.json({
        success: true,
        message: "Comuna obtida com sucesso",
        data: comuna,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter comuna", 404);
    }
  }

  static async getComunasByMunicipio(req, res) {
    try {
      const { municipioId } = req.params;
      const comunas = await GeographicService.getComunasByMunicipio(municipioId);
      
      res.json({
        success: true,
        message: "Comunas do município obtidas com sucesso",
        data: comunas,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter comunas do município", 500);
    }
  }

  // ===============================
  // OPERAÇÕES ESPECIAIS
  // ===============================

  static async getGeographicHierarchy(req, res) {
    try {
      const hierarchy = await GeographicService.getGeographicHierarchy();
      
      res.json({
        success: true,
        message: "Hierarquia geográfica obtida com sucesso",
        data: hierarchy,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter hierarquia geográfica", 500);
    }
  }

  static async searchGeographic(req, res) {
    try {
      const { q: searchTerm } = req.query;
      
      if (!searchTerm || searchTerm.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Termo de busca deve ter pelo menos 2 caracteres",
        });
      }

      const results = await GeographicService.searchByName(searchTerm.trim());
      
      res.json({
        success: true,
        message: "Busca geográfica realizada com sucesso",
        data: results,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao realizar busca geográfica", 500);
    }
  }
}
