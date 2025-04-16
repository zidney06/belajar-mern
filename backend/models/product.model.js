import mongoose from 'mongoose'

const skemaBarang = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  }
}, {
  timestamps: true //jika true, maka saaat memasukan data kedalam db akan ada satu data tambahan yaitu data tanggal
})

const Product = mongoose.model('Product', skemaBarang)

export default Product