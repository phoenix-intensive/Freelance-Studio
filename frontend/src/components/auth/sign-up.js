import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {AuthService} from "../../services/auth-service";

export class SignUp {
    constructor(openNewRoute) {

        this.openNewRoute = openNewRoute;

        //Если пользователь уже имеет accessToken, т.е он зареган, то переводим его на главную стр.  дашборда
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.findElements();

        this.validations = [
            {element: this.nameElement},
            {element: this.lastNameElement},
            {element: this.emailElement, options: {pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/}},
            {element: this.passwordRepeatElement, options: {compareTo: this.passwordElement.value}},
            {element: this.agreeMeElement, options: {checked: true}},
        ];

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }

    findElements() {
        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('last-name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.agreeMeElement = document.getElementById('agree');
        this.commonErrorElement = document.getElementById('common-error');
    };


    async signUp() {
        this.commonErrorElement.style.display = 'none'

        for (let i = 0; i < this.validations.length; i++) {
            if (this.validations[i].element === this.passwordRepeatElement) {
                this.validations[i].options.compareTo = this.passwordElement.value;
            }
        }

        if (ValidationUtils.validateForm(this.validations)) {
            //request
            const signUpResult = await AuthService.signUp({
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value,
            });

            if (signUpResult) {
                AuthUtils.setAuthInfo(signUpResult.accessToken, signUpResult.refreshToken, {
                    id: signUpResult.id,
                    name: signUpResult.name
                });

                //Переход на главную страницу-дашборд
                return this.openNewRoute('/');
            }
            this.commonErrorElement.style.display = 'block'
        }
    }
}