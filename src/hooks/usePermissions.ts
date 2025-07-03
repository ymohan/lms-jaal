import { useAuth } from '../contexts/AuthContext';
import { SecurityUtils } from '../utils/security';

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (resource: string, action: string): boolean => {
    return SecurityUtils.hasPermission(user, resource, action);
  };

  const canCreateCourse = (): boolean => {
    return hasPermission('course', 'create') || user?.role === 'admin' || user?.role === 'teacher';
  };

  const canEditCourse = (courseId: string): boolean => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'teacher') {
      // Check if user is the course owner
      return hasPermission('course', 'edit');
    }
    return false;
  };

  const canDeleteCourse = (courseId: string): boolean => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'teacher') {
      return hasPermission('course', 'delete');
    }
    return false;
  };

  const canManageUsers = (): boolean => {
    return user?.role === 'admin' && hasPermission('user', 'manage');
  };

  const canViewAnalytics = (): boolean => {
    return hasPermission('analytics', 'view') || user?.role === 'admin' || user?.role === 'teacher';
  };

  const canIssueCertificates = (): boolean => {
    return hasPermission('certificate', 'issue') || user?.role === 'admin' || user?.role === 'teacher';
  };

  return {
    hasPermission,
    canCreateCourse,
    canEditCourse,
    canDeleteCourse,
    canManageUsers,
    canViewAnalytics,
    canIssueCertificates,
  };
}