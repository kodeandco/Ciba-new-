const express = require('express');
const router = express.Router();
const Testimonial = require('../models/testimonials_model.js');
const authMiddleware = require("../middleware/authMiddleware");

// Middleware for error handling
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation middleware
const validateTestimonial = (req, res, next) => {
  const { name, designation, company, message } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  }
  if (!designation || designation.trim().length === 0) {
    errors.push('Designation is required');
  }
  if (!company || company.trim().length === 0) {
    errors.push('Company is required');
  }
  if (!message || message.trim().length < 20) {
    errors.push('Message must be at least 20 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

// ===================================
// PUBLIC ROUTES (No authentication)
// ===================================

// @route   GET /api/testimonials/active
// @desc    Get only active testimonials (PUBLIC)
// @access  Public
router.get('/active', asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.getActive();

  res.status(200).json({
    success: true,
    count: testimonials.length,
    data: testimonials
  });
}));

// @route   GET /api/testimonials/featured
// @desc    Get featured testimonials (PUBLIC)
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.getFeatured();

  res.status(200).json({
    success: true,
    count: testimonials.length,
    data: testimonials
  });
}));

// @route   GET /api/testimonials
// @desc    Get all testimonials (PUBLIC - with optional filters)
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { 
    isActive, 
    featured, 
    limit = 10, 
    page = 1,
    sortBy = 'displayOrder',
    order = 'asc'
  } = req.query;

  // Build query
  const query = {};
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }
  if (featured !== undefined) {
    query.featured = featured === 'true';
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOrder = order === 'desc' ? -1 : 1;

  // Execute query with pagination
  const testimonials = await Testimonial.find(query)
    .sort({ [sortBy]: sortOrder })
    .limit(parseInt(limit))
    .skip(skip)
    .select('-__v');

  const total = await Testimonial.countDocuments(query);

  res.status(200).json({
    success: true,
    count: testimonials.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: testimonials
  });
}));

// @route   GET /api/testimonials/:id
// @desc    Get single testimonial by ID (PUBLIC)
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id).select('-__v');

  if (!testimonial) {
    return res.status(404).json({
      success: false,
      message: 'Testimonial not found'
    });
  }

  res.status(200).json({
    success: true,
    data: testimonial
  });
}));

// ===================================
// PROTECTED ROUTES (Admin only)
// ===================================

// @route   POST /api/testimonials
// @desc    Create new testimonial (PROTECTED)
// @access  Private
router.post('/', authMiddleware, validateTestimonial, asyncHandler(async (req, res) => {
  const testimonialData = {
    name: req.body.name,
    designation: req.body.designation,
    company: req.body.company,
    message: req.body.message,
    image: req.body.image || null,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    displayOrder: req.body.displayOrder || 0,
    rating: req.body.rating || 5,
    featured: req.body.featured || false,
    createdBy: req.user._id // Track who created it
  };

  const testimonial = await Testimonial.create(testimonialData);

  res.status(201).json({
    success: true,
    message: 'Testimonial created successfully',
    data: testimonial
  });
}));

// @route   PUT /api/testimonials/:id
// @desc    Update testimonial (PROTECTED)
// @access  Private
router.put('/:id', authMiddleware, validateTestimonial, asyncHandler(async (req, res) => {
  let testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return res.status(404).json({
      success: false,
      message: 'Testimonial not found'
    });
  }

  const updateData = {
    name: req.body.name,
    designation: req.body.designation,
    company: req.body.company,
    message: req.body.message,
    image: req.body.image,
    isActive: req.body.isActive,
    displayOrder: req.body.displayOrder,
    rating: req.body.rating,
    featured: req.body.featured,
    updatedBy: req.user._id // Track who updated it
  };

  testimonial = await Testimonial.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Testimonial updated successfully',
    data: testimonial
  });
}));

// @route   PATCH /api/testimonials/:id/toggle-active
// @desc    Toggle active status (PROTECTED)
// @access  Private
router.patch('/:id/toggle-active', authMiddleware, asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return res.status(404).json({
      success: false,
      message: 'Testimonial not found'
    });
  }

  await testimonial.toggleActive();

  res.status(200).json({
    success: true,
    message: `Testimonial ${testimonial.isActive ? 'activated' : 'deactivated'} successfully`,
    data: testimonial
  });
}));

// @route   PATCH /api/testimonials/:id/toggle-featured
// @desc    Toggle featured status (PROTECTED)
// @access  Private
router.patch('/:id/toggle-featured', authMiddleware, asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return res.status(404).json({
      success: false,
      message: 'Testimonial not found'
    });
  }

  await testimonial.toggleFeatured();

  res.status(200).json({
    success: true,
    message: `Testimonial ${testimonial.featured ? 'featured' : 'unfeatured'} successfully`,
    data: testimonial
  });
}));

// @route   PATCH /api/testimonials/reorder
// @desc    Reorder testimonials (PROTECTED)
// @access  Private
router.patch('/reorder', authMiddleware, asyncHandler(async (req, res) => {
  const { testimonials } = req.body;

  if (!Array.isArray(testimonials)) {
    return res.status(400).json({
      success: false,
      message: 'Testimonials must be an array of {id, displayOrder}'
    });
  }

  const updatePromises = testimonials.map(({ id, displayOrder }) =>
    Testimonial.findByIdAndUpdate(id, { displayOrder })
  );

  await Promise.all(updatePromises);

  res.status(200).json({
    success: true,
    message: 'Testimonials reordered successfully'
  });
}));

// @route   DELETE /api/testimonials/:id
// @desc    Delete testimonial (PROTECTED)
// @access  Private
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return res.status(404).json({
      success: false,
      message: 'Testimonial not found'
    });
  }

  await testimonial.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Testimonial deleted successfully',
    data: {}
  });
}));

// @route   DELETE /api/testimonials
// @desc    Delete multiple testimonials (PROTECTED)
// @access  Private
router.delete('/', authMiddleware, asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an array of testimonial IDs'
    });
  }

  const result = await Testimonial.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} testimonials deleted successfully`,
    data: { deletedCount: result.deletedCount }
  });
}));

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

module.exports = router;