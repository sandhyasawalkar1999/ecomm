const express = require('express');
const dbConnect = require('./config/dbConnect.js');
const dotenv = require('dotenv').config();
const authRouter = require('./routes/authRouter.js');
const { notFound, errorHandler } = require('./middlewares/errorHandler.js');
const cookieParser = require('cookie-parser');
const productRouter = require("./routes/productRoute.js")
const morgan = require('morgan');
const blogRouter = require('./routes/blogRoutes.js')

const app = express();

app.use(morgan("dev")); //middleware to
app.use(express.json()); //middleware to parse json request
app.use(cookieParser()); //middleware to cookie parser


app.use('/api/v1/user', authRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/blog', blogRouter);


app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 8000;
dbConnect();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});