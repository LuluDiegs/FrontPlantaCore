import { useMemo, useState } from 'react';
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
      { value: 'frequente', label: 'Rego com frequência' },
      { value: 'pouca', label: 'Rego às vezes' },
      { value: 'raramente', label: 'Quase não rego' },
    ],
  },
  {
    field: 'seguranca',
    title: 'Existe alguma restrição de segurança?',
    subtitle: 'Isso ajuda a evitar plantas inadequadas para pets ou crianças.',
    icon: Shield,
    options: [
      { value: 'sem restricoes', label: 'Sem restrições' },
      { value: 'pets', label: 'Tenho pets' },
      { value: 'criancas', label: 'Tenho crianças' },
      { value: 'pets e criancas', label: 'Tenho pets e crianças' },
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
      { value: 'purificacao', label: 'Purificar o ambiente' },
    ],
  },
];

function extractResult(raw) {
  const visited = new Set();

  function normalizeUrl(url) {
    if (!url || typeof url !== 'string') return '';
    const trimmed = url.trim();

    if (!trimmed) return '';
    if (trimmed.startsWith('//')) return `https:${trimmed}`;
    return trimmed;
  }

  function looksLikeImageUrl(value) {
    if (typeof value !== 'string') return false;
    const v = value.toLowerCase().trim();

    return (
      v.startsWith('http') &&
      (
        v.includes('.jpg') ||
        v.includes('.jpeg') ||
        v.includes('.png') ||
        v.includes('.webp') ||
        v.includes('.gif') ||
        v.includes('image') ||
        v.includes('img')
      )
    );
  }

  function findInObject(value) {
    if (!value || typeof value !== 'object') return null;
    if (visited.has(value)) return null;
    visited.add(value);

    const nomeComum =
      value.nomeComum ??
      value.NomeComum ??
      value.nome ??
      value.Nome ??
      value.nomePlanta ??
      value.nome_planta ??
      value.common_name ??
      '';

    let urlImagem =
      value.urlImagem ??
      value.UrlImagem ??
      value.imagem ??
      value.Imagem ??
      value.imageUrl ??
      value.image_url ??
      value.imagemUrl ??
      value.ImagemUrl ??
      value.urlFoto ??
      value.UrlFoto ??
      value.foto ??
      value.Foto ??
      value.photo ??
      value.thumbnail ??
      value.thumbnailUrl ??
      value.default_image?.medium_url ??
      value.default_image?.original_url ??
      value.default_image?.regular_url ??
      value.default_image?.small_url ??
      '';

    const justificativa =
      value.justificativa ??
      value.Justificativa ??
      value.descricao ??
      value.Descricao ??
      value.motivo ??
      value.Motivo ??
      value.texto ??
      value.Texto ??
      value.reason ??
      '';

    urlImagem = normalizeUrl(urlImagem);

    if (!urlImagem) {
      for (const key of Object.keys(value)) {
        const current = value[key];
        if (looksLikeImageUrl(current)) {
          urlImagem = normalizeUrl(current);
          break;
        }
      }
    }

    if (nomeComum || urlImagem || justificativa) {
      return {
        nomeComum: String(nomeComum || ''),
        urlImagem: String(urlImagem || ''),
        justificativa: String(justificativa || ''),
      };
    }

    for (const key of Object.keys(value)) {
      const found = findInObject(value[key]);
      if (found) return found;
    }

    return null;
  }

  return (
    findInObject(raw) || {
      nomeComum: '',
      urlImagem: '',
      justificativa: '',
    }
  );
}

export default function RecommendPlantPage() {
  const recommend = useRecommendPlant();

  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isSubmittingRecommendation, setIsSubmittingRecommendation] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  const result = useMemo(() => extractResult(recommend.data), [recommend.data]);

  const summary = useMemo(() => {
    const labels = [
      STEPS[0].options.find((item) => item.value === form.experiencia)?.label,
      STEPS[1].options.find((item) => item.value === form.iluminacao)?.label,
      STEPS[2].options.find((item) => item.value === form.regagem)?.label,
      STEPS[3].options.find((item) => item.value === form.seguranca)?.label,
      STEPS[4].options.find((item) => item.value === form.proposito)?.label,
    ].filter(Boolean);

    return labels.join(' • ');
  }, [form]);

  const hasRecommendation =
    !!result.nomeComum || !!result.urlImagem || !!result.justificativa;

  const isLoadingResult = isSubmittingRecommendation || recommend.isPending;

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

    setImageError(false);
    setShowResult(true);
    setIsSubmittingRecommendation(true);

    recommend.mutate(form, {
      onSuccess: (data) => {
        console.log('RESPOSTA BRUTA DA API:', data);
      },
      onError: (error) => {
        console.error('ERRO NA RECOMENDAÇÃO:', error?.response?.data || error);
      },
      onSettled: () => {
        setIsSubmittingRecommendation(false);
      },
    });
  }

  function handleRestart() {
    setStep(0);
    setShowResult(false);
    setIsSubmittingRecommendation(false);
    setImageError(false);
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
              Responda algumas perguntas rápidas e descubra uma planta que combine
              com seu espaço, sua rotina e o que você busca no dia a dia.
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
              <span>
                Etapa {step} de {totalSteps}
              </span>
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
                  disabled={!currentValue || isLoadingResult}
                >
                  {isLoadingResult
                    ? 'Buscando...'
                    : 'Finalizar e ver recomendação'}
                </button>
              )}
            </div>
          </section>
        )}

        {showResult && (
          <section className={styles.resultCard}>
            <div className={styles.resultTop}>
              <span className={styles.eyebrow}>Sua seleção</span>
              <h2>
                {isLoadingResult
                  ? 'Estamos preparando sua recomendação'
                  : hasRecommendation
                  ? 'Prontinho, aqui está sua recomendação'
                  : 'Não conseguimos concluir sua recomendação'}
              </h2>
              <p>
                {isLoadingResult
                  ? summary
                  : hasRecommendation
                  ? summary
                  : 'Suas respostas foram recebidas, mas a recomendação não pôde ser carregada agora.'}
              </p>
            </div>

            {isLoadingResult ? (
              <div className={styles.loadingBox}>
                <div className={styles.loadingEmoji}>🌿</div>
                <h3>Buscando a melhor opção...</h3>
                <p>Estamos analisando suas respostas.</p>
              </div>
            ) : hasRecommendation ? (
              <div className={styles.resultContent}>
                {result.urlImagem && !imageError ? (
                  <img
                    src={result.urlImagem}
                    alt={result.nomeComum || 'Planta recomendada'}
                    className={styles.resultImage}
                    onError={() => {
                      console.log('URL da imagem falhou:', result.urlImagem);
                      setImageError(true);
                    }}
                  />
                ) : (
                  <div className={styles.imageFallback}>🪴</div>
                )}

                <div className={styles.resultText}>
                  <span className={styles.resultLabel}>Planta recomendada</span>
                  <h3>{result.nomeComum || 'Planta recomendada'}</h3>
                  <p>
                    {result.justificativa || 'Sem descrição disponível no momento.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className={styles.loadingBox}>
                <div className={styles.loadingEmoji}>🌱</div>
                <h3>Não conseguimos carregar sua recomendação</h3>
                <p>Tente novamente em instantes.</p>
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