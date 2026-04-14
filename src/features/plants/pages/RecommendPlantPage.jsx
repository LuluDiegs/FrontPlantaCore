import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Shield,
  Droplets,
  Sun,
  Leaf,
  Heart,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import styles from './RecommendPlantPage.module.css';
import { useRecommendPlant } from '../hooks/usePlants';

const STEPS = [
  {
    field: 'experiencia',
    title: 'Qual sua experiência com plantas?',
    subtitle: 'Assim a recomendação combina com seu nível de cuidado.',
    icon: Leaf,
    options: [
      { value: 'iniciante', label: 'Iniciante' },
      { value: 'intermediario', label: 'Intermediário' },
      { value: 'avancado', label: 'Avançado' },
    ],
  },
  {
    field: 'iluminacao',
    title: 'Como é a iluminação do ambiente?',
    subtitle: 'A luz faz toda diferença na escolha da planta.',
    icon: Sun,
    options: [
      { value: 'sol-direto', label: 'Sol direto' },
      { value: 'meia-sombra', label: 'Meia-sombra' },
      { value: 'sombra', label: 'Sombra' },
    ],
  },
  {
    field: 'regagem',
    title: 'Como costuma ser sua rotina de rega?',
    subtitle: 'Vamos indicar uma planta que combine com seu ritmo.',
    icon: Droplets,
    options: [
      { value: 'rega-frequente', label: 'Rego com frequência' },
      { value: 'rego-as-vezes', label: 'Rego às vezes' },
      { value: 'quase-nao-rega', label: 'Quase não rego' },
    ],
  },
  {
    field: 'seguranca',
    title: 'Existe alguma restrição de segurança?',
    subtitle: 'Isso ajuda a evitar plantas inadequadas para pets ou crianças.',
    icon: Shield,
    options: [
      { value: 'sem-restricoes', label: 'Sem restrições' },
      { value: 'tenho-pets', label: 'Tenho pets' },
      { value: 'tenho-criancas', label: 'Tenho crianças' },
      { value: 'tenho-pets-e-criancas', label: 'Tenho pets e crianças' },
    ],
  },
  {
    field: 'proposito',
    title: 'O que você quer priorizar?',
    subtitle: 'Pode ser estética, aroma, uso medicinal ou purificação.',
    icon: Heart,
    options: [
      { value: 'estetica', label: 'Estética' },
      { value: 'aromatica', label: 'Aromática' },
      { value: 'medicinal', label: 'Medicinal' },
      { value: 'purificar-ambiente', label: 'Purificar o ambiente' },
    ],
  },
];

function getResultData(raw) {
  const data = raw?.dados?.dados || raw?.dados || raw?.data?.dados?.dados || raw?.data?.dados || raw;
  return {
    nomeComum: data?.nomeComum || data?.NomeComum || '',
    urlImagem: data?.urlImagem || data?.UrlImagem || '',
    justificativa: data?.justificativa || data?.Justificativa || '',
  };
}

export default function RecommendPlantPage() {
  const recommend = useRecommendPlant();

  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [form, setForm] = useState({
    experiencia: '',
    iluminacao: '',
    regagem: '',
    seguranca: '',
    proposito: '',
  });

  const totalSteps = STEPS.length;
  const currentStep = step > 0 ? STEPS[step - 1] : null;
  const currentValue = currentStep ? form[currentStep.field] : '';

  const result = getResultData(recommend.data);

  const summary = [
    form.experiencia,
    form.iluminacao,
    form.regagem,
    form.seguranca,
    form.proposito,
  ]
    .filter(Boolean)
    .join(' • ');

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleStart() {
    setStep(1);
    setShowResult(false);
  }

  function handleBack() {
    if (step === 1) {
      setStep(0);
      return;
    }

    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  }

  function handleNext() {
    if (!currentValue) return;

    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.experiencia ||
      !form.iluminacao ||
      !form.regagem ||
      !form.seguranca ||
      !form.proposito
    ) {
      return;
    }

    setShowResult(true);
    recommend.mutate(form);
  }

  function handleRestart() {
    setStep(0);
    setShowResult(false);
    setForm({
      experiencia: '',
      iluminacao: '',
      regagem: '',
      seguranca: '',
      proposito: '',
    });

    if (typeof recommend.reset === 'function') {
      recommend.reset();
    }
  }

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {step === 0 && !showResult && (
          <section className={styles.startCard}>
            <div className={styles.badge}>
              <Sparkles size={16} />
              <span>Recomendação inteligente</span>
            </div>

          <h1>Descubra a planta ideal para o seu espaço</h1>
              <p>
        Responda algumas perguntas rápidas e descubra uma planta que combine com seu espaço, sua rotina e o que você busca no dia a dia.
      </p>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleStart}
            >
              Iniciar questionário
            </button>
          </section>
        )}

        {step > 0 && !showResult && currentStep && (
          <section className={styles.quizCard}>
           <div className={styles.progressRow}>
           <span>Etapa {step} de {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>

            <div className={styles.questionHeader}>
              <div className={styles.iconBox}>
                <currentStep.icon size={20} />
              </div>

              <div>
                <span className={styles.eyebrow}>Pergunta</span>
                <h2>{currentStep.title}</h2>
                <p>{currentStep.subtitle}</p>
              </div>
            </div>

            <div className={styles.options}>
              {currentStep.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.optionButton} ${
                    currentValue === option.value ? styles.optionButtonActive : ''
                  }`}
                  onClick={() => updateField(currentStep.field, option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className={styles.navigation}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleBack}
              >
                <ArrowLeft size={18} />
                Voltar
              </button>

              {step < totalSteps ? (
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleNext}
                  disabled={!currentValue}
                >
                  Próxima
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleSubmit}
                  disabled={!currentValue || recommend.isPending}
                >
                  {recommend.isPending ? 'Buscando...' : 'Finalizar e ver recomendação'}
                </button>
              )}
            </div>
          </section>
        )}

        {showResult && (
          <section className={styles.resultCard}>
            <div className={styles.resultTop}>
              <span className={styles.eyebrow}>Sua seleção</span>
              <h2>Prontinho, aqui está sua recomendação</h2>
              <p>{summary}</p>
            </div>

            {recommend.isPending ? (
              <div className={styles.loadingBox}>
                <div className={styles.loadingEmoji}>🌿</div>
                <h3>Buscando a melhor opção...</h3>
                <p>Estamos analisando suas respostas.</p>
              </div>
            ) : result.nomeComum ? (
              <div className={styles.resultContent}>
                {result.urlImagem ? (
                  <img
                    src={result.urlImagem}
                    alt={result.nomeComum}
                    className={styles.resultImage}
                  />
                ) : (
                  <div className={styles.imageFallback}>🪴</div>
                )}

                <div className={styles.resultText}>
                  <span className={styles.resultLabel}>Planta recomendada</span>
                  <h3>{result.nomeComum}</h3>
                  <p>{result.justificativa}</p>
                </div>
              </div>
            ) : (
              <div className={styles.loadingBox}>
                <div className={styles.loadingEmoji}>🌱</div>
                <h3>Não foi possível carregar a recomendação agora</h3>
                <p>Tente novamente daqui a pouco.</p>
              </div>
            )}

            <div className={styles.resultActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleRestart}
              >
                Refazer questionário
              </button>
            </div>
          </section>
        )}
      </motion.div>
    </div>
  );
}