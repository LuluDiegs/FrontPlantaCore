import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, User, FileText } from 'lucide-react'
import { useMyProfile, useUpdateProfile, useUploadProfilePhoto } from '../hooks/useProfile'
import ChangePasswordModal from '../components/ChangePasswordModal'
import DeleteAccountModal from '../components/DeleteAccountModal'
import Avatar from '../../../shared/components/ui/Avatar'
import Input from '../../../shared/components/ui/Input'
import Button from '../../../shared/components/ui/Button'
import Spinner from '../../../shared/components/ui/Spinner'
import styles from './EditProfilePage.module.css'

const editProfileSchema = z.object({
  nome: z.string().min(2, 'Mínimo de 2 caracteres').max(255),
  biografia: z.string().max(500, 'Máximo de 500 caracteres').optional().or(z.literal('')),
  privado: z.boolean().optional(),
});

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useMyProfile();
  const updateProfile = useUpdateProfile();
  const uploadPhoto = useUploadProfilePhoto();

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(editProfileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        nome: profile.nome || '',
        biografia: profile.biografia || '',
        privado: !!profile.privado,
      });
    }
  }, [profile, reset]);

  const onSubmit = (data) => {
    const changes = {};
    if (data.nome !== profile.nome) changes.nome = data.nome;
    if (data.biografia !== (profile.biografia || '')) changes.biografia = data.biografia;
    if (typeof data.privado !== 'undefined' && data.privado !== !!profile.privado) changes.privado = data.privado;

    if (Object.keys(changes).length === 0) return;

    updateProfile.mutate(changes, {
      onSuccess: () => navigate('/perfil'),
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadPhoto.mutate(file);
  };

  if (isLoading) return <Spinner />;
  if (!profile) return null;

  return (
    <div>
      <button className={styles.back} onClick={() => navigate('/perfil')}>
        <ArrowLeft size={20} />
        Voltar ao perfil
      </button>

      <h1 className={styles.title}>Editar Perfil</h1>

      <div className={styles.photoSection}>
        <Avatar src={profile.fotoPerfil} alt={profile.nome} size="xl" />
        <label className={styles.photoBtn}>
          {uploadPhoto.isPending ? 'Enviando...' : 'Trocar foto'}
          <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
        </label>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Input
          label="Nome"
          placeholder="Seu nome"
          icon={User}
          error={errors.nome?.message}
          {...register('nome')}
        />

        <div className={styles.textareaGroup}>
          <label className={styles.label}>
            <FileText size={16} />
            Biografia
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Conte algo sobre você..."
            rows={4}
            maxLength={500}
            {...register('biografia')}
          />
          {errors.biografia && (
            <span className={styles.error}>{errors.biografia.message}</span>
          )}
        </div>

        <div className={styles.privacyGroup}>
          <div className={styles.privacyTop}>
            <div className={styles.switchWrap}>
              <button
                type="button"
                role="switch"
                aria-pressed={!!watch('privado')}
                aria-checked={!!watch('privado')}
                className={`${styles.switchButton} ${watch('privado') ? styles.on : ''}`}
                onClick={() => setValue('privado', !watch('privado'), { shouldDirty: true })}
              >
                <span className={styles.switchTrack} />
                <span className={styles.switchThumb} />
              </button>
            </div>

            <div className={styles.privacyLabel}>
              <span className={styles.privacyTitle}>Conta privada</span>
            </div>

            {/* keep field registered for form submission */}
            <input type="checkbox" {...register('privado')} hidden />
          </div>

          <div className={styles.privacyMeta}>
            <span className={`${styles.privacyBadge} ${watch('privado') ? styles.badgePrivate : styles.badgePublic}`}>
              {watch('privado') ? 'Privado' : 'Público'}
            </span>
            <div className={styles.privacyHint}>
              {watch('privado')
                ? 'A conta está privada — apenas seus seguidores aprovados veem suas postagens.'
                : 'Conta pública — qualquer pessoa pode ver suas postagens.'}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={() => navigate('/perfil')}>
            Cancelar
          </Button>
          <Button type="submit" loading={updateProfile.isPending} disabled={!isDirty}>
            Salvar
          </Button>
        </div>
      </form>

      <div className={styles.securitySection}>
        <h2>Segurança</h2>
        <div className={styles.securityActions}>
          <Button variant="secondary" fullWidth onClick={() => setChangePasswordOpen(true)}>
            Alterar Senha
          </Button>
          <Button variant="danger" fullWidth onClick={() => setDeleteAccountOpen(true)}>
            Deletar Conta
          </Button>
        </div>
      </div>

      <ChangePasswordModal isOpen={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
      <DeleteAccountModal isOpen={deleteAccountOpen} onClose={() => setDeleteAccountOpen(false)} />
    </div>
  );
}
