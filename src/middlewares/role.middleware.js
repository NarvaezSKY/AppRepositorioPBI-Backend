import jwt from 'jsonwebtoken';

const VALID_ROLES = ['admin', 'gfpi'];

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload?.role || !VALID_ROLES.includes(payload.role)) {
      return res.status(401).json({ message: 'Invalid token role' });
    }

    req.user = {
      id: payload.id,
      role: payload.role,
    };

    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({ message: 'User role not found in request' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }

    next();
  };
};

export { authenticate, authorizeRoles };