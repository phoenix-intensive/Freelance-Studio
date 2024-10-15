import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {AuthService} from "../../services/auth-service";

export class Login {
    constructor(openNewRoute) {

        this.openNewRoute = openNewRoute;

        //Если пользователь уже имеет accessToken, т.е он зареган, то переводим его на главную стр.  дашборда
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.findElements();

        this.validations = [
            {element: this.passwordElement},
            {element: this.emailElement, options: {pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/}},
        ];

        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }


    findElements() {
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('remember-me');
        this.commonErrorElement = document.getElementById('common-error');
    };

    async login() {
        this.commonErrorElement.style.display = 'none'

        if (ValidationUtils.validateForm(this.validations)) {
            //request
            const loginResult = await AuthService.logIn({
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked,
            });

            if (loginResult) {
                AuthUtils.setAuthInfo(loginResult.accessToken, loginResult.refreshToken, {
                    id: loginResult.id,
                    name: loginResult.name
                });

                //Переход на главную страницу-дашборд
                return this.openNewRoute('/');
            }
                this.commonErrorElement.style.display = 'block'

        }
    }
}