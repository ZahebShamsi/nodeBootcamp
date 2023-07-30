

exports.getTourById = catchAsync(async (req,res, next) => {
    const tours = await Tour.findById(req.params.id);


    //  return common 404 error using AppError Class
  if(!tours){
    return next(new AppError('No tour found with this Id' , 404)) // 
  }

    res.status(200).json({
        'status' : 'success',
        data : { tours }
    })

})