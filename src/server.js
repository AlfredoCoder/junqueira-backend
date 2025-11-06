import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Importar utilitários BigInt
import { bigIntMiddleware } from './utils/bigint.utils.js';

// Importar rotas
import authRoutes from './routes/auth.routes.js';
import userssRoutes from './routes/users.routes.js';
import geographicRoutes from './routes/geographic.routes.js';
import institutionalRoutes from './routes/institutional.routes.js';
import institutionalManagementRoutes from './routes/institutional-management.routes.js';
import academicManagementRoutes from './routes/academic-management.routes.js';
import studentManagementRoutes from './routes/student-management.routes.js';
import statusControlRoutes from './routes/status-control.routes.js';
import financialServicesRoutes from './routes/financial-services.routes.js';
import paymentManagementRoutes from './routes/payment-management.routes.js';
import saftRoutes from './routes/saft.routes.js';
import academicStaffRoutes from './routes/academic-staff.routes.js';
import academicEvaluationRoutes from './routes/academic-evaluation.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import professoresRoutes from './routes/professores.routes.js';
import notasRoutes from './routes/notas.routes.js';
import turmasRoutes from './routes/turmas.routes.js';
import periodosLancamentoRoutes from './routes/periodos-lancamento.routes.js';
import professorRoutes from './routes/professor.routes.js';
import professorAtribuicoesRoutes from './routes/professor-atribuicoes.routes.js';
import gradeCurricularRoutes from './routes/grade-curricular.routes.js';
import seedRoutes from './routes/seed.routes.js';
import trimestresRoutes from './routes/trimestres.routes.js';
import academicManagementImplRoutes from './routes/academic-management-impl.routes.js';
import alunoRoutes from './routes/aluno.routes.js';

// Importar Swagger
import { swaggerDocs } from './config/swagger.js';

dotenv.config();

const app = express();

// Desabilitar ETag para evitar cache 304
app.set('etag', false);

// Middlewares globais
app.use(morgan('dev'));

// Configuração CORS mais específica
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para lidar com BigInt automaticamente
app.use(bigIntMiddleware);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Jomorais Backend',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      geographic: '/api/geographic',
      institutional: '/api/institutional',
      institutionalManagement: '/api/institutional-management',
      academicManagement: '/api/academic-management',
      studentManagement: '/api/student-management',
      statusControl: '/api/status-control',
      financialServices: '/api/financial-services',
      paymentManagement: '/api/payment-management',
      academicStaff: '/api/academic-staff',
      academicEvaluation: '/api/academic-evaluation',
      dashboard: '/api/dashboard',
      professores: '/api/professores',
      notas: '/api/notas',
      turmas: '/api/turmas',
      periodosLancamento: '/api/periodos-lancamento',
      professor: '/api/professor',
      docs: '/api/docs'
    }
  });
});

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userssRoutes);
app.use('/api/geographic', geographicRoutes);
app.use('/api/institutional', institutionalRoutes);
app.use('/api/institutional-management', institutionalManagementRoutes);
app.use('/api/academic-management', academicManagementRoutes);
app.use('/api/student-management', studentManagementRoutes);
app.use('/api/status-control', statusControlRoutes);
app.use('/api/financial-services', financialServicesRoutes);
app.use('/api/payment-management', paymentManagementRoutes);
app.use('/api/finance-management/saft', saftRoutes);
app.use('/api/academic-staff', academicStaffRoutes);
app.use('/api/academic-evaluation', academicEvaluationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/professores', professoresRoutes);
app.use('/api/notas', notasRoutes);
app.use('/api/turmas', turmasRoutes);
app.use('/api/periodos-lancamento', periodosLancamentoRoutes);
app.use('/api/professor', professorRoutes);
app.use('/api', professorAtribuicoesRoutes);
app.use('/api/grade-curricular', gradeCurricularRoutes);
app.use('/api/academic-management/grade-curricular', gradeCurricularRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/academic-evaluation/trimestres', trimestresRoutes);
app.use('/api/academic-management', academicManagementImplRoutes);
app.use('/api/aluno', alunoRoutes);

// Documentação Swagger
swaggerDocs(app);

// Middleware de tratamento de erros globais (deve ser o último)
app.use((err, req, res, next) => {
  console.error('Erro global capturado:', err);
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'JSON inválido'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

const PORT = process.env.PORT || 8000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Para Vercel, exportar o app em vez de usar listen
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em ${BASE_URL}`);
  });
}

// Exportar para Vercel
export default app;
