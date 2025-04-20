import mongoose from 'mongoose'

const skemaBarang = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	author: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  ISBN: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true //jika true, maka saaat memasukan data kedalam db akan ada satu data tambahan yaitu data tanggal
})

const Product = mongoose.model('Product', skemaBarang)

export default Product