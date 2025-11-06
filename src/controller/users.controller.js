import { UsersServices } from "../services/users.services.js";
import { handleControllerError } from "../utils/validation.utils.js";

export class UsersController {
  static async getAllLegacyUsers(req, res, next) {
    try {
      await UsersServices.getAllLegacyUsers(req, res);
    } catch (error) {
      handleControllerError(
        res,
        error,
        "Erro ao obter tipos de utilizador",
        500
      );
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      await UsersServices.getAllUsers(req, res);
    } catch (error) {
      handleControllerError(
        res,
        error,
        "Erro ao obter tipos de utilizador",
        500
      );
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await UsersServices.getUserById(req.params.id);
      res.json({
        success: true,
        message: "Usuário obtido com sucesso",
        data: user,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter utilizador por ID", 500);
    }
  }

  static async getUserLegacyById(req, res) {
    try {
      const user = await UsersServices.getUserLegacyById(req.params.id);
      res.json({
        success: true,
        message: "Utilizador legado obtido com sucesso",
        data: user,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter utilizador legado por ID", 500);
    }
  }

  static async createLegacyUser(req, res) {
    try {
      const user = await UsersServices.createLegacyUser(req.body);
      res.status(201).json({
        success: true,
        message: "Utilizador criado com sucesso",
        data: user,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar utilizador", 500);
    }
  }

  static async updateLegacyUser(req, res) {
    try {
      const user = await UsersServices.updateLegacyUser(req.params.id, req.body);
      res.json({
        success: true,
        message: "Utilizador atualizado com sucesso",
        data: user,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar utilizador", 500);
    }
  }

  static async deleteLegacyUser(req, res) {
    try {
      await UsersServices.deleteLegacyUser(req.params.id);
      res.json({
        success: true,
        message: "Utilizador excluído com sucesso",
      });
    } catch (error) {
      console.error('❌ Erro no controller deleteLegacyUser:', error);
      
      // Se for um AppError, usar a mensagem específica
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      
      // Caso contrário, usar o handler padrão
      handleControllerError(res, error, "Erro ao excluir utilizador", 500);
    }
  }

  static async deactivateLegacyUser(req, res) {
    try {
      const user = await UsersServices.deactivateLegacyUser(req.params.id);
      res.json({
        success: true,
        message: "Utilizador desativado com sucesso",
        data: user,
      });
    } catch (error) {
      console.error('❌ Erro no controller deactivateLegacyUser:', error);
      
      // Se for um AppError, usar a mensagem específica
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      
      // Caso contrário, usar o handler padrão
      handleControllerError(res, error, "Erro ao desativar utilizador", 500);
    }
  }
}
