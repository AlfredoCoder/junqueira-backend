// routes/periodos-lancamento.routes.js
import express from 'express';
import { PeriodosLancamentoController } from '../controllers/periodos-lancamento.controller.js';
import { requirePermission } from '../middleware/permissions.middleware.js';
import { authenticateIntegratedToken } from '../middleware/integrated-auth.middleware.js';

const router = express.Router();

// Listar todos os períodos
router.get('/', authenticateIntegratedToken, requirePermission('periodosLancamento', 'view'), PeriodosLancamentoController.listarPeriodos);

// Listar períodos ativos (sem autenticação para professores)
router.get('/ativos', PeriodosLancamentoController.listarPeriodosAtivos);

// Listar anos letivos (sem autenticação para formulários)
router.get('/anos-letivos', PeriodosLancamentoController.listarAnosLetivos);

// Criar período
router.post('/', authenticateIntegratedToken, requirePermission('periodosLancamento', 'create'), PeriodosLancamentoController.criarPeriodo);

// Alterar status
router.put('/:id/status', authenticateIntegratedToken, requirePermission('periodosLancamento', 'edit'), PeriodosLancamentoController.alterarStatusPeriodo);

// Excluir período
router.delete('/:id', authenticateIntegratedToken, requirePermission('periodosLancamento', 'delete'), PeriodosLancamentoController.excluirPeriodo);

export default router;
