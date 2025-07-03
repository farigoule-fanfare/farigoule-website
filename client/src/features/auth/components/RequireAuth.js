import { Navigate, useLocation } from 'react-router-dom';
import PropTypes          from 'prop-types';
import { Loading }            from '@shell';
import { useAuth }        from '@features/auth';

function RequireAuth({ children, requiredRole }) {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const location = useLocation();

  /* 1. Encore en cours de vérif => spinner */
  if (isLoading) return <Loading />;

  /* 2. Pas connecté => redirection login */
  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />;

  /* 3. Rôle insuffisant */
  if (requiredRole) {
    const roles = currentUser.roles;
    if (!roles.includes(requiredRole))
      return <Navigate to="/" replace />;          // ou /403
  }

  /* 4. OK */
  return children;
}

RequireAuth.propTypes = {
  children:     PropTypes.node.isRequired,
  requiredRole: PropTypes.string,                 // ex. 'admin'
};

export default RequireAuth;
