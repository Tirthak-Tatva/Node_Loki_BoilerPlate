import { json } from "body-parser";
import { Response, Request, NextFunction } from "express";
import httpStatus from "http-status";
import {
  generateAccessToken,
  sendVerificationPush,
  validateGoogleRecaptcha,
} from "../utils/utils";
import LoginRequest from "../models/login.request";
import { MongoClient } from "mongodb";
import { config } from "../config/const";
import { v4 as uuidv4 } from "uuid";
let i = 0;
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestBody: LoginRequest = req.body;
  const captchaValidated: boolean = await validateGoogleRecaptcha(
    requestBody.recaptchaCode
  );
  console.log(captchaValidated);

  if (!captchaValidated) {
    return res
      .status(httpStatus.FORBIDDEN)
      .send({ message: "Invalid Captcha attempt!!!" });
  }
  return res.json({ message: "Logged In Successfully!!" });
};

export const requestDeviceVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(++i);

  const requestBody: any = req.body;
  const client = await MongoClient.connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("OctopusMock");

  const quotesCollection = db.collection("registered_device");
  const nonce = uuidv4();
  req.body.nonce = nonce;
  const event = await quotesCollection.insertOne(req.body);
  console.log(`requestDeviceVerification DB result ${event.result} ${i}`);
  client.close();

  //sent Push Notification
  // if (i % 2 != 0) {
  if (true) {
    setTimeout(async () => {
      const pushres = await sendVerificationPush(
        req.body.device_registration_token
      );
      console.log(req.body.device_registration_token);

      console.log(
        `pushres ${JSON.stringify(pushres.data)} ${pushres.status} ${
          pushres.statusText
        }`
      );
    }, 2000);
  } else {
    console.log("Restricting Push Notification to check Google Captcha");
  }

  return res.json({ nonce });
};

export const requestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestBody: any = req.body;
  return res.send({
    num_otp_digits: 6,
    message:
      "Continuing with the OTP validation will disconnect the previous device from your account.",
    interaction_id: uuidv4(),
  });
};

export const gettokens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestBody: any = req.body;

  return res.json({
    access_token: generateAccessToken("ACCESS_TOKEN", req.body.phone, 600),
    id_token: generateAccessToken("ID_TOKEN", req.body.phone, 600),
    refresh_token: generateAccessToken("REFRESH_TOKEN", req.body.phone, 900),
  });
};

export const meta = async (req: Request, res: Response, next: NextFunction) => {
  const requestBody: any = req.body;
  return res.status(204).send();
};
