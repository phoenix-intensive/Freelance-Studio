import {HttpUtils} from "../utils/http-utils.js";

export class AuthService {
    static async logIn(data) {
        //request
        const result = await HttpUtils.request('/login', 'POST', false, data);


        if (result.response.error || !result.response || (result.response && (!result.response.accessToken || !result.response.refreshToken || !result.response.id || !result.response.name))) {
            return false;
        }

        return result.response;
    }


    static async signUp(data) {
        //request
        const result = await HttpUtils.request('/signup', 'POST', false, data);


        if (result.response.error || !result.response || (result.response && (!result.response.accessToken || !result.response.refreshToken || !result.response.id || !result.response.name))) {
            return false;
        }

        return result.response;
    }


    static async logOut(data) {
        //request
        await HttpUtils.request('/logout', 'POST', false, data);
    }
}