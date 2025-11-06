import express from 'express';
import {
  getSalas,
  getSalaById,
  createSala,
  updateSala,
  deleteSala,
  getAllSalas
} from '../controllers/salas.controller.js';

const router = express.Router();

// Rotas para salas
router.get('/', getSalas);
router.get('/all', getAllSalas);
router.get('/:id', getSalaById);
router.post('/', createSala);
router.put('/:id', updateSala);
router.delete('/:id', deleteSala);

export default router;
