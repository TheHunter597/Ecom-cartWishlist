import jwt from "jsonwebtoken";
import createFakeCart from "./createFakeCart";
export async function createFakeUser(id = "test_user") {
  let fakeToken = jwt.sign({ user_id: id }, process.env.JWTSECRET as string);
  await createFakeCart(id);
  return {
    user_id: id,
    token: fakeToken,
  };
}
