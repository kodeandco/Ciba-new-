const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
      maxlength: [100, 'Designation cannot exceed 100 characters']
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [150, 'Company name cannot exceed 150 characters']
    },
    message: {
      type: String,
      required: [true, 'Testimonial message is required'],
      trim: true,
      minlength: [20, 'Message must be at least 20 characters'],
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    image: {
      type: String,
      default: null,
      validate: {
        validator: function(v) {
          // Allow null or valid URL/data URI
          if (!v) return true;
          return /^(https?:\/\/.+|data:image\/.+)/.test(v);
        },
        message: 'Please provide a valid image URL or data URI'
      }
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    displayOrder: {
      type: Number,
      default: 0,
      min: [0, 'Display order must be a positive number']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    approvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
testimonialSchema.index({ isActive: 1, displayOrder: 1 });
testimonialSchema.index({ featured: 1, isActive: 1 });
testimonialSchema.index({ createdAt: -1 });

// Virtual for getting initials if no image
testimonialSchema.virtual('initials').get(function() {
  return this.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

// Pre-save middleware to handle display order
testimonialSchema.pre('save', async function(next) {
  if (this.isNew && this.displayOrder === 0) {
    const count = await this.constructor.countDocuments();
    this.displayOrder = count + 1;
  }
  next();
});

// Static method to get active testimonials
testimonialSchema.statics.getActive = function() {
  return this.find({ isActive: true })
    .sort({ displayOrder: 1 })
    .select('-__v');
};

// Static method to get featured testimonials
testimonialSchema.statics.getFeatured = function() {
  return this.find({ isActive: true, featured: true })
    .sort({ displayOrder: 1 })
    .select('-__v');
};

// Instance method to toggle active status
testimonialSchema.methods.toggleActive = function() {
  this.isActive = !this.isActive;
  return this.save();
};

// Instance method to toggle featured status
testimonialSchema.methods.toggleFeatured = function() {
  this.featured = !this.featured;
  return this.save();
};

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;