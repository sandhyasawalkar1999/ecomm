
//not Found
const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};


//Error handling

const errorHandler = (err, req, res, next) => {
  res.status(res.statusCode === 200 ? 500 : res.statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
}

module.exports = { notFound, errorHandler };