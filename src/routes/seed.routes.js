import express from 'express';
import { seedPeriodos, seedSalas, seedAcademico } from '../controllers/seed.controller.js';

const router = express.Router();

// Rota para seed de períodos
router.post('/periodos', seedPeriodos);

// Rota para seed de salas
router.post('/salas', seedSalas);

// Rota para seed acadêmico completo
router.post('/academico', seedAcademico);

export default router;
