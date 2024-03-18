import jwt from "jsonwebtoken";
import crypto from "crypto";
const generateAuthToken = (expiresIn = "15m", payload: any) => {
  // const payload = {
  //   _id: this._id,
  //   role: this.role,
  //   email: this.email,
  //   firstName: this.firstName,
  //   lastName: this.lastName,
  // }
  const secret = process.env.JWT_SECRET!;
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const encodedHeader = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: expiresIn,
  });

  const encodedPayload = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: expiresIn,
  });

  const token = crypto
    .createHmac("sha256", secret)
    .update(encodedHeader + "." + encodedPayload)
    .digest("hex");

  return encodedHeader + "." + encodedPayload + "." + token;
  // const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  //   modulusLength: 2048,
  //   publicKeyEncoding: { type: "spki", format: "pem" },
  //   privateKeyEncoding: { type: "pkcs8", format: "pem" },
  // });
  // const encryptedPayload = crypto.publicEncrypt(
  //   publicKey,
  //   Buffer.from(JSON.stringify(payload))
  // );
  // console.log(
  //   "Encrypted payload",
  //   encryptedPayload.toString("base64"),
  //   encryptedPayload
  // );
  // console.log("Public key", publicKey);
  // console.log("Private key", privateKey);
  // let token = jwt.sign(payload, privateKey, {
  //   algorithm: "RS256",
  //   expiresIn: expiresIn,
  // });
  // return token;
};

const verifyAuthToken = (token: string): any => {
  const secret = process.env.JWT_SECRET!;
  const decodedData = jwt.verify(
    token,
    secret,
    {
      algorithms: ["HS256"],
    },
    (err, decoded) => {
      if (err) {
        console.log(err);
        if (err.name === "TokenExpiredError") {
          throw new Error("Access denied. Token expired");
        } else if (err.name === "JsonWebTokenError") {
          throw new Error("Access denied. Invalid token");
        } else {
          throw new Error("Error");
        }
      }
      return decoded;
    }
  );
  return decodedData;
};
export { generateAuthToken, verifyAuthToken };
