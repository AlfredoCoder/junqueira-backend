import express from 'express';
import { AcademicManagementController } from '../controller/academic-management.controller.js';

const router = express.Router();

// ========== SALAS - CRUD ==========
router.post('/salas', AcademicManagementController.createSala);
router.get('/salas', AcademicManagementController.getSalas);
router.get('/salas/:id', AcademicManagementController.getSalaById);
router.put('/salas/:id', AcademicManagementController.updateSala);
router.delete('/salas/:id', AcademicManagementController.deleteSala);

export default router;
