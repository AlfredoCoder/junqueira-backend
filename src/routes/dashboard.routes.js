// routes/dashboard.routes.js
import express from 'express';
import { DashboardController } from '../controller/dashboard.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Endpoints para dados do dashboard administrativo
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Obter todos os dados do dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados completos do dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                     enrollmentEvolution:
 *                       type: array
 *                     monthlyRevenue:
 *                       type: array
 *                     gradeDistribution:
 *                       type: array
 *                     weeklyAttendance:
 *                       type: array
 *                     recentActivity:
 *                       type: array
 *                     systemStatus:
 *                       type: object
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', authenticateToken, DashboardController.getDashboardData);

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Obter estatísticas gerais
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas gerais do sistema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalStudents:
 *                       type: integer
 *                     activeStudents:
 *                       type: integer
 *                     totalTeachers:
 *                       type: integer
 *                     activeTeachers:
 *                       type: integer
 *                     totalRevenue:
 *                       type: number
 *                     totalPayments:
 *                       type: integer
 *                     activityRate:
 *                       type: number
 *                     studentGrowth:
 *                       type: string
 *                     teacherGrowth:
 *                       type: string
 *                     revenueGrowth:
 *                       type: string
 */
router.get('/stats', authenticateToken, DashboardController.getDashboardStats);

/**
 * @swagger
 * /api/dashboard/enrollment-evolution:
 *   get:
 *     summary: Obter evolução de matrículas
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados de evolução de matrículas dos últimos 9 meses
 */
router.get('/enrollment-evolution', authenticateToken, DashboardController.getEnrollmentEvolution);

/**
 * @swagger
 * /api/dashboard/monthly-revenue:
 *   get:
 *     summary: Obter receita mensal
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados de receita dos últimos 6 meses
 */
router.get('/monthly-revenue', authenticateToken, DashboardController.getMonthlyRevenue);

/**
 * @swagger
 * /api/dashboard/grade-distribution:
 *   get:
 *     summary: Obter distribuição de notas
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Distribuição percentual de notas
 */
router.get('/grade-distribution', authenticateToken, DashboardController.getGradeDistribution);

/**
 * @swagger
 * /api/dashboard/weekly-attendance:
 *   get:
 *     summary: Obter presença semanal
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados de presença por dia da semana
 */
router.get('/weekly-attendance', authenticateToken, DashboardController.getWeeklyAttendance);

/**
 * @swagger
 * /api/dashboard/recent-activity:
 *   get:
 *     summary: Obter atividades recentes
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de atividades a retornar
 *     responses:
 *       200:
 *         description: Lista de atividades recentes do sistema
 */
router.get('/recent-activity', authenticateToken, DashboardController.getRecentActivity);

/**
 * @swagger
 * /api/dashboard/system-status:
 *   get:
 *     summary: Obter status do sistema
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informações sobre o estado do sistema
 */
router.get('/system-status', authenticateToken, DashboardController.getSystemStatus);

export default router;
