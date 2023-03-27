import * as argon2 from "argon2";

export const passwordHashing = async (password) => {
  try {
    const hash = await argon2.hash(password);
    console.log('password::', hash);
    return hash;
  } catch(e) {
    console.log(e);
    return e;
  }
} 

export const passwordVerifying = async (hashPassword, password) => {
  try {
    if (await argon2.verify(hashPassword, password)) {
      return true;
    } else {
      return false;
    }
  } catch(e) {
    console.log("error:", e);
    return e;
  }
}