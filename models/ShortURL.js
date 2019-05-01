const mongoose = require('mongoose')

const {MongooseAutoIncrementID} = require('mongoose-auto-increment-reworked')

const ShortURLSchema = new mongoose.Schema({
  shortURL: {type: Number, required: true, unique: true},
  originalURL: {type: String, required: true, unique: true}
})

const plugin = new MongooseAutoIncrementID(ShortURLSchema, 'ShortURL', {field: 'shortURL'})
 
plugin.applyPlugin()
  .then(() => {
    // Plugin ready to use! You don't need to wait for this promise - any save queries will just get queued.
    // Every document will have an auto-incremented number value on _id.
  })
  .catch(e => {})


module.exports = mongoose.model('ShortURL', ShortURLSchema)