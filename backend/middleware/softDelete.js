// Middleware to filter out soft-deleted documents
const softDeleteFilter = (req, res, next) => {
  // Override find/findOne to exclude isDeleted
  const originalFind = req.Model?.find;
  // This is handled at the route level by adding { isDeleted: { $ne: true } }
  next();
};

// Add soft-delete fields to any schema
const softDeletePlugin = (schema) => {
  schema.add({
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    deletedBy: { type: 'ObjectId', ref: 'User' },
  });

  // Soft delete method
  schema.methods.softDelete = function (userId) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = userId;
    return this.save();
  };

  // Static: find non-deleted
  schema.statics.findActive = function (filter = {}) {
    return this.find({ ...filter, isDeleted: { $ne: true } });
  };

  // Static: restore
  schema.statics.restore = function (id) {
    return this.findByIdAndUpdate(id, { isDeleted: false, deletedAt: null, deletedBy: null }, { new: true });
  };

  // Auto-filter: override find to exclude deleted by default
  const autoFilter = function (next) {
    if (this.getQuery().isDeleted === undefined && this.getQuery()._id === undefined) {
      this.where({ isDeleted: { $ne: true } });
    }
    next();
  };
  schema.pre('find', autoFilter);
  schema.pre('findOne', autoFilter);
  schema.pre('countDocuments', autoFilter);
};

module.exports = { softDeleteFilter, softDeletePlugin };
