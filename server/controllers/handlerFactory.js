const catchAsync = require('./../utils/catchAsync')
const AppError= require('./../utils/appError')

exports.deleteOne = Model => 
  catchAsync(async (req,res,next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) {
      // If doc is null or undefined, an error occurred
      return next(new AppError(`No ${Model.modelName} found with id ${req.params.id}`, 404, 'Database'))
    }

    res.status(204).json({
      status: 'success',
      data: null
    })
  })

exports.updateOne = Model => {
  catchAsync(async (req,res,next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      // If doc is null or undefined, an error occurred
      return next(new AppError(`Unable to find ${Model.modelName} with id ${req.params.id}`, 404, 'Database'))
    }
    
    res.status(200).json({
      status: 'success',
      data: doc
    })
    
  })
}

exports.createOne = Model => 
  catchAsync(async (req,res,next) => {
    const doc = await Model.create(req.body)

    if (!doc) {
      // If doc is null or undefined, an error occurred
      return next(new AppError(`Unable to create ${Model.modelName} document`, 500, 'Database'))
    }

    res.status(201).json({
      status : 'success',
      data: doc
    })
  })

exports.getOne = (Model, popOptions) => 
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if (popOptions) query = query.populate(popOptions)
    const doc = await query

    if (!doc) {
      // If doc is null or undefined, an error occurred
      return next(new AppError(`Unable to find ${Model.modelName} with id ${req.params.id}`, 404, 'Database'))
    }

    res.status(200).json({
      status: 'success',
      data: doc
    })
  })

exports.getAll = Model => 
  catchAsync(async (req,res,next) => {
    const docs = await Model.find()

    if (docs.length === 0) {
      // If doc is null or undefined, or an error occurred
      return next(new AppError(`Unable to find ${Model.modelName}`, 404, 'Database'))
    }

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: docs
    })
  })