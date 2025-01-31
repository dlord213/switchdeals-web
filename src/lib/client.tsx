import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

export const client = wrapper(axios.create());
export const cookieJar = new CookieJar();

export const createScraperClient = () => {
  const cookieJar = new CookieJar();
  return wrapper(axios.create({ jar: cookieJar }));
};
