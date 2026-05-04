import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthGuard from '../shared/components/guards/AuthGuard';
import GuestGuard from '../shared/components/guards/GuestGuard';
import AppLayout from '../shared/components/Layout/AppLayout';
import ErrorBoundary from '../shared/components/ErrorBoundary';
import Spinner from '../shared/components/ui/Spinner';
//teste
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const ResetPasswordPage = lazy(() => import('../features/auth/pages/ResetPasswordPage'));
const NewPasswordPage = lazy(() => import('../features/auth/pages/NewPasswordPage'));
const ConfirmEmailPage = lazy(() => import('../features/auth/pages/ConfirmEmailPage'));

const FeedPage = lazy(() => import('../features/posts/pages/FeedPage'));
const ExplorePage = lazy(() => import('../features/posts/pages/ExplorePage'));
const PostDetailPage = lazy(() => import('../features/posts/pages/PostDetailPage'));
const CreatePostPage = lazy(() => import('../features/posts/pages/CreatePostPage'));
const SavedPostsPage = lazy(() => import('../features/posts/pages/SavedPostsPage'));

const IdentifyPage = lazy(() => import('../features/plants/pages/IdentifyPage'));
const MyPlantsPage = lazy(() => import('../features/plants/pages/MyPlantsPage'));
const PlantDetailPage = lazy(() => import('../features/plants/pages/PlantDetailPage'));
const SearchPlantPage = lazy(() => import('../features/plants/pages/SearchPlantPage'));
const RecommendPlantPage = lazy(() => import('../features/plants/pages/RecommendPlantPage'));

const MyProfilePage = lazy(() => import('../features/profile/pages/MyProfilePage'));
const UserProfilePage = lazy(() => import('../features/profile/pages/UserProfilePage'));
const EditProfilePage = lazy(() => import('../features/profile/pages/EditProfilePage'));
const FollowRequestsPage = lazy(() => import('../features/profile/pages/FollowRequestsPage'));

const NotificationsPage = lazy(() => import('../features/notifications/pages/NotificationsPage'));
const ComunidadesPage = lazy(() => import('../features/comunidade/pages/ComunidadesPage'));
const ComunidadeDetailPage = lazy(() => import('../features/comunidade/pages/ComunidadeDetailPage'));
const DiscoveryPage = lazy(() => import('../features/discovery/pages/DiscoveryPage'));
const StoresPage = lazy(() => import('../features/stores/pages/StoresPage'));
const NotFoundPage = lazy(() => import('../shared/pages/NotFoundPage'));

const EventsPage = lazy(() => import('../features/events/pages/EventsPage'));
const CreateUpdateEventPage = lazy(() => import('../features/events/pages/CreateUpdateEventPage'));
const EventDetailPage = lazy(() => import('../features/events/pages/EventDetailPage'));

export default function AppRouter() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route element={<GuestGuard />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registrar" element={<RegisterPage />} />
            <Route path="/resetar-senha" element={<ResetPasswordPage />} />
          </Route>

          <Route path="/confirmar-email" element={<ConfirmEmailPage />} />
          <Route path="/nova-senha" element={<NewPasswordPage />} />

          <Route element={<AuthGuard />}>
            <Route element={<AppLayout />}>
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/explorar" element={<ExplorePage />} />
              <Route path="/buscar" element={<DiscoveryPage />} />
              <Route path="/lojas" element={<StoresPage />} />
              <Route path="/identificar" element={<IdentifyPage />} />
              <Route path="/buscar-planta" element={<SearchPlantPage />} />
              <Route path="/recomendar-planta" element={<RecommendPlantPage />} />
              <Route path="/minhas-plantas" element={<MyPlantsPage />} />
              <Route path="/planta/:plantaId" element={<PlantDetailPage />} />
              <Route path="/comunidades" element={<ComunidadesPage />} />
              <Route path="/comunidade/:comunidadeId" element={<ComunidadeDetailPage />} />
              <Route path="/post/:postId" element={<PostDetailPage />} />
              <Route path="/criar-post" element={<CreatePostPage />} />
              <Route path="/salvos" element={<SavedPostsPage />} />
              <Route path="/perfil" element={<MyProfilePage />} />
              <Route path="/perfil/editar" element={<EditProfilePage />} />
              <Route path="/perfil/solicitacoes" element={<FollowRequestsPage />} />
              <Route path="/usuario/:usuarioId" element={<UserProfilePage />} />
              <Route path="/notificacoes" element={<NotificationsPage />} />
              <Route path="/eventos" element={<EventsPage />} />
              <Route path="/eventos/:id" element={<EventDetailPage />} />
              <Route path="/criar-evento" element={<CreateUpdateEventPage />} />
              <Route path="/editar-evento/:id" element={<CreateUpdateEventPage />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
