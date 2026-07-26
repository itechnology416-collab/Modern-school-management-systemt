const ActivityLog = require('../models/ActivityLog');

// Generic audit logging middleware
const auditLog = (action, resource, getDetails = null) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      // Log only successful operations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const details = getDetails ? getDetails(req, body) : { body: body };
        ActivityLog.create({
          userId: req.user?._id,
          userEmail: req.user?.email,
          userRole: req.user?.role,
          action,
          resource,
          resourceId: req.params?.id || body?._id,
          details,
          ip: req.ip || req.headers['x-forwarded-for'],
          userAgent: req.headers['user-agent'],
          schoolId: req.user?.schoolId,
          status: 'success',
        }).catch(err => console.error('Audit log error:', err.message));
      }
      return originalJson(body);
    };
    next();
  };
};

// Login/logout logger
const logAuthEvent = async (user, action, ip, userAgent, status = 'success') => {
  await ActivityLog.create({
    userId: user._id,
    userEmail: user.email,
    userRole: user.role,
    action,
    resource: 'Auth',
    ip: ip || '0.0.0.0',
    userAgent: userAgent || 'unknown',
    schoolId: user.schoolId,
    status,
  }).catch(err => console.error('Auth log error:', err.message));
};

module.exports = { auditLog, logAuthEvent };
