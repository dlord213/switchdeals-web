import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

export const client = wrapper(axios.create());
export const cookieJar = new CookieJar();
