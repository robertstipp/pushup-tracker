const Pushup = require('../models/Pushup')
const factory = require('./handlerFactory')

exports.getAllPushups = factory.getAll(Pushup)
exports.getPushup = factory.getOne(Pushup)
exports.createPushup = factory.createOne(Pushup)
exports.updatePushup = factory.updateOne(Pushup)
exports.deletePushup = factory.deleteOne(Pushup)