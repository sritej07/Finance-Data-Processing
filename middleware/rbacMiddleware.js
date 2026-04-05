const rolePermissions = {
  Viewer: ["read"],
  Analyst: ["read", "dashboard"],
  Admin: ["read", "dashboard", "create", "update", "delete"]
};

const authorizeAccess = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.auth?.role;

    if (!userRole) {
      res.status(401);
      return next(new Error("User role not found in token."));
    }

    const allowedPermissions = rolePermissions[userRole] || [];

    if (!allowedPermissions.includes(requiredPermission)) {
      res.status(403);
      return next(
        new Error(`Access denied. ${userRole} role cannot perform ${requiredPermission} actions.`)
      );
    }

    next();
  };
};

module.exports = {
  authorizeAccess,
  rolePermissions
};
