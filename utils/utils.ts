import * as jwt from "jsonwebtoken";

export const TOKEN_SECRET =
  "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611";

export const generateAccessToken = (type: any, username: any, expiresIn?: string | number) => {
  return jwt.sign(
    {
      username,
      type,
    },
    TOKEN_SECRET,
    { expiresIn: expiresIn }
  );
};
