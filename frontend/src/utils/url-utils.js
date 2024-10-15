export class UrlUtils {
    static getUrlParam(param) {
        //Достаем id пользователя из url адреса
        const urlParams = new URLSearchParams(window.location.search)
        return urlParams.get(param);
    }
}