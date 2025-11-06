// controller/dashboard.controller.js
import { DashboardService } from '../services/dashboard.services.js';

export class DashboardController {
  /**
   * Obter estatísticas gerais do dashboard
   * GET /api/dashboard/stats
   */
  static async getDashboardStats(req, res, next) {
    try {
      const stats = await DashboardService.getDashboardStats();

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obter evolução de matrículas
   * GET /api/dashboard/enrollment-evolution
   */
  static async getEnrollmentEvolution(req, res, next) {
    try {
      const enrollmentData = await DashboardService.getEnrollmentEvolution();

      return res.status(200).json({
        success: true,
        data: enrollmentData
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obter receita mensal
   * GET /api/dashboard/monthly-revenue
   */
  static async getMonthlyRevenue(req, res, next) {
    try {
      const revenueData = await DashboardService.getMonthlyRevenue();

      return res.status(200).json({
        success: true,
        data: revenueData
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obter distribuição de notas
   * GET /api/dashboard/grade-distribution
   */
  static async getGradeDistribution(req, res, next) {
    try {
      const gradeData = await DashboardService.getGradeDistribution();

      return res.status(200).json({
        success: true,
        data: gradeData
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obter presença semanal
   * GET /api/dashboard/weekly-attendance
   */
  static async getWeeklyAttendance(req, res, next) {
    try {
      const attendanceData = await DashboardService.getWeeklyAttendance();

      return res.status(200).json({
        success: true,
        data: attendanceData
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obter atividades recentes
   * GET /api/dashboard/recent-activity
   */
  static async getRecentActivity(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const activities = await DashboardService.getRecentActivity(limit);

      return res.status(200).json({
        success: true,
        data: activities
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obter status do sistema
   * GET /api/dashboard/system-status
   */
  static async getSystemStatus(req, res, next) {
    try {
      const status = await DashboardService.getSystemStatus();

      return res.status(200).json({
        success: true,
        data: status
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obter todos os dados do dashboard de uma vez
   * GET /api/dashboard
   */
  static async getDashboardData(req, res, next) {
    try {
      const dashboardData = await DashboardService.getDashboardData();

      return res.status(200).json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      next(error);
    }
  }
}

export default DashboardController;
