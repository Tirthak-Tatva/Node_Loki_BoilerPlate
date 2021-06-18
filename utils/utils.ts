import Axios from "axios";
import { v4 as uuidv4 } from "uuid";
import * as jwt from "jsonwebtoken";

export const TOKEN_SECRET =
  "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611";

export async function validateGoogleRecaptcha(code: string): Promise<boolean> {
  const humanKey = code;
  const googleCaptchaVerify = "https://www.google.com/recaptcha/api/siteverify";
  const RECAPTCHA_SERVER_KEY = "6LdMmZ8aAAAAAIxtwFyrq5nVvfJCXD5lqLIJcsNt";
  // Validate Human
  const isHuman = await Axios.request({
    url: `${googleCaptchaVerify}?secret=${RECAPTCHA_SERVER_KEY}&response=${humanKey}`,
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    },
  }).catch((err) => {
    throw new Error(`Error in Google Siteverify API. ${err.message}`);
  });
  if (humanKey === null || !isHuman.data.success) {
    return false;
  }
  return true;
}

export const sendVerificationPush = async (registration_ids: any) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization:
      "key=AAAALkL64vU:APA91bFeKmw1y786nSkJg5HwewIwZx8VSHSIQLM5e2VUPcu8Ufge279Le4Z7a1e0Bpa_v6Q_yeHfC2sxSoLCfORschQo0cpNM9jIg6hzzfvunugC0i4bULnc5ZCPNo1DY1Pn_jzLmHS4",
  };

  const res = await Axios.post(
    "https://fcm.googleapis.com/fcm/send",
    // {
    //   to: registration_ids,
    //   notification: {
    //     title: "q",
    //     body: "q",
    //   },
    //   "content-available": 1,
    //   priority: "high",
    //   data: {
    //     verification_token: uuidv4(),
    //   },
    // },
    {
      "to" : registration_ids,
     "content_available": true, // for iOS
     "apns-priority": 5, // for iOS
     "data": {
        verification_token: uuidv4(),
      },
      "priority":"high" // for android
     },
    {
      headers: headers,
    }
  );

  return res;
};

export const generateAccessToken = (type: any, username: any, expiresIn?: string | number) => {
  console.log(`SECRETTTTTTT ${process.env.TOKEN_SECRET}`);

  return jwt.sign(
    {
      username,
      type,
    },
    TOKEN_SECRET,
    { expiresIn: expiresIn }
  );
};
