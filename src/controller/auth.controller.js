import {
  registerSchema,
  loginSchema,
  legacyRegisterSchema,
  legacyLoginSchema,
  changePasswordLegacySchema,
  resetPasswordLegacySchema,
  userIdParamSchema,
} from "../validations/auth.validations.js";

import { AuthService } from "../services/auth.services.js";
import { handleControllerError } from "../utils/validation.utils.js";

export class AuthController {

  static async register(req, res) {
    try {
      console.log("Dados recebidos no controller:", req.body);
      const validatedData = registerSchema.parse(req.body);
      console.log("Dados validados no controller:", validatedData);
      const user = await AuthService.registerUser(validatedData);

      res.status(201).json({
        success: true,
        message: "Usuário registrado com sucesso",
        data: user,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao registrar usuário", 400);
    }
  }

  static async login(req, res) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await AuthService.loginUser(validatedData);

      res.json({
        success: true,
        message: "Login realizado com sucesso",
        data: result,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao fazer login", 401);
    }
  }

  static async legacyRegister(req, res) {
    try {
      console.log("Dados recebidos no controller legado:", req.body);
      const validatedData = legacyRegisterSchema.parse(req.body);
      console.log("Dados validados no controller legado:", validatedData);
      const user = await AuthService.registerLegacyUser(validatedData);

      res.status(201).json({
        success: true,
        message: "Utilizador registrado com sucesso",
        data: user,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao registrar utilizador", 400);
    }
  }

  static async legacyLogin(req, res) {
    try {
      const validatedData = legacyLoginSchema.parse(req.body);
      const result = await AuthService.loginLegacyUser(validatedData);

      res.json({
        success: true,
        message: "Login realizado com sucesso",
        data: result,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao fazer login", 401);
    }
  }

  static async updateProfile(req, res) {
    try {
      const validatedData = updateProfileSchema.parse(req.body);

      if (req.user?.legacy) {
        return res.status(403).json({
          success: false,
          message: "Usuários do sistema legado não podem atualizar perfil",
        });
      }

      const user = await AuthService.updateUserProfile(
        req.user.id,
        validatedData
      );

      res.json({
        success: true,
        message: "Perfil atualizado com sucesso",
        data: user,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar perfil", 400);
    }
  }

  static async legacyLogout(req, res) {
    try {
      await AuthService.logoutLegacyUser(req.user.id);
      res.json({
        success: true,
        message: "Logout realizado com sucesso",
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao fazer logout", 500);
    }
  }

  static async legacyMe(req, res) {
    try {
      const user = await AuthService.getCurrentLegacyUser(req.user.id);
      res.json({
        success: true,
        message: "Usuário atual obtido com sucesso",
        data: user,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter usuário atual", 500);
    }
  }

  static async me(req, res) {
    try {
      const user = await AuthService.getCurrentUser(req.user.id);
      res.json({
        success: true,
        message: "Usuário atual obtido com sucesso",
        data: user,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter usuário atual", 500);
    }
  }

  static async getUserTypes(req, res) {
    try {
      const types = await AuthService.getUserTypes();
      res.json({ success: true, data: types });
    } catch (error) {
      handleControllerError(
        res,
        error,
        "Erro ao obter tipos de utilizador",
        500
      );
    }
  }

  // ===============================
  // MUDANÇA DE SENHA - USUÁRIO LEGADO
  // ===============================

  static async changePasswordLegacy(req, res) {
    try {
      const { userId } = userIdParamSchema.parse(req.params);
      const validatedData = changePasswordLegacySchema.parse(req.body);

      const result = await AuthService.changePasswordLegacy(
        userId,
        validatedData.currentPassword,
        validatedData.newPassword
      );

      res.json({
        success: true,
        message: result.message,
        data: result.user
      });
    } catch (error) {
      handleControllerError(
        res,
        error,
        "Erro ao alterar senha",
        400
      );
    }
  }

  static async resetPasswordLegacy(req, res) {
    try {
      const validatedData = resetPasswordLegacySchema.parse(req.body);
      
      // Pegar o ID do admin do token JWT se disponível
      const adminUserId = req.user?.codigo || validatedData.adminUserId;

      const result = await AuthService.resetPasswordLegacy(
        validatedData.userId,
        validatedData.newPassword,
        adminUserId
      );

      res.json({
        success: true,
        message: result.message,
        data: result.user
      });
    } catch (error) {
      handleControllerError(
        res,
        error,
        "Erro ao resetar senha",
        400
      );
    }
  }

  static async getCurrentUserLegacy(req, res) {
    try {
      const userId = req.user?.codigo;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Token inválido ou usuário não autenticado"
        });
      }

      const user = await AuthService.getUserById(userId);
      
      res.json({
        success: true,
        message: "Dados do usuário obtidos com sucesso",
        data: user
      });
    } catch (error) {
      handleControllerError(
        res,
        error,
        "Erro ao obter dados do usuário",
        400
      );
    }
  }
}
