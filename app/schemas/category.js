var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CategorySchema = new Schema({
  name: String,
  movies: [{
    type: ObjectId,
    ref: 'Movie'
  }],
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      defalut: Date.now()
    }
  }
});

CategorySchema.pre('save', function(next) {
  if(this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else {
    this.updateAt = Date.now();
  }
  next();
});

CategorySchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .exec(cb)
  }
};


module.exports = CategorySchema;