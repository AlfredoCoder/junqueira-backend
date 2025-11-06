import express from 'express';
import {
  getTrimestres,
  getTrimestreById,
  createTrimestre,
  updateTrimestre,
  deleteTrimestre
} from '../controllers/trimestres.controller.js';

const router = express.Router();

// Rotas para trimestres
router.get('/', getTrimestres);
router.get('/:id', getTrimestreById);
router.post('/', createTrimestre);
router.put('/:id', updateTrimestre);
router.delete('/:id', deleteTrimestre);

export default router;
