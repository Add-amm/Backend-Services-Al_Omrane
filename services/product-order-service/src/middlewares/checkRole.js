export function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.user.id_role)) {
        return res.status(403).json({ message: 'Accès refusé, role manquant' });
      }
      next();
    };
};