import express, {  } from "express";
import helmet from "helmet";
import cors from "cors";
import httpStatus from "http-status";
import routes from "./routes";
import ApiError from "./utils/ApiError";
import bodyParser from "body-parser";

const xss = require("xss-clean");
var cookieParser = require('cookie-parser')


const app = express();

// set security HTTP headers
app.use(helmet());

app.use(express.static(__dirname + '/uploads'));

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// sanitize request data
app.use(xss());

app.use(cookieParser())

// enable cors
app.use(cors());
// app.options("*", cors);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

app.use("/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});


app.listen(process.env.PORT || 8899, () => {
  
  console.log(`Listening to port ${process.env.PORT || 8899}`);
});
