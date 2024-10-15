import {HttpUtils} from "../../utils/http-utils.js";
import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";
import {FileUtils} from "../../utils/file-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {UrlUtils} from "../../utils/url-utils.js";
import {FreelancersService} from "../../services/freelancers-service.js";

export class FreelancesEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        //Достаем id пользователя из url адреса
        const id = UrlUtils.Order('id');

        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('updateButton').addEventListener('click', this.updateFreelancer.bind(this));

        bsCustomFileInput.init(); // Для загрузки аватара

        this.findElements();


        this.validations = [
            {element: this.nameInputElement},
            {element: this.lastNameInputElement},
            {element: this.educationInputElement},
            {element: this.locationInputElement},
            {element: this.skillsInputElement},
            {element: this.infoInputElement},
            {element: this.emailInputElement, options: {pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/}},
        ];

        this.getFreelancer(id).then();
    }


    findElements() {
        this.nameInputElement = document.getElementById('nameInput');
        this.lastNameInputElement = document.getElementById('lastNameInput');
        this.emailInputElement = document.getElementById('emailInput');
        this.educationInputElement = document.getElementById('educationInput');
        this.locationInputElement = document.getElementById('locationInput');
        this.skillsInputElement = document.getElementById('skillsInput');
        this.infoInputElement = document.getElementById('infoInput');
        this.levelSelectElement = document.getElementById('levelSelect');
        this.avatarInputElement = document.getElementById('avatarInput');
    };


    async getFreelancer(id) {
        //request
        const response = await FreelancersService.getFreelancer(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        //freelancerOriginalData - изначальные данные фрилансера
        this.freelancerOriginalData = response.freelancer;

        this.showFreelancer(response.freelancer);
    }


    showFreelancer(freelancer) {

        const breadCrumbsElement = document.getElementById('breadcrumbs-freelancer');
        breadCrumbsElement.href = '/freelancers/view?id=' + freelancer.id;
        breadCrumbsElement.innerText = freelancer.name + ' ' + freelancer.lastName;

        //Подгружаем аватар фрилансера по нужному пути
        if (freelancer.avatar) {
            document.getElementById('avatar').src = config.host + freelancer.avatar;
        }
        //Подгружаем уровень знаний
        document.getElementById('level').innerHTML = CommonUtils.getLevelHtml(freelancer.level);


        //Подгружаем инфу в ИНПУТЫ
        //Подгружаем Имя
        this.nameInputElement.value = freelancer.name;
        //Подгружаем Фамилию
        this.lastNameInputElement.value = freelancer.lastName;
        //Подгружаем email
        this.emailInputElement.value = freelancer.email;
        //Подгружаем образование
        this.educationInputElement.value = freelancer.education;
        //Подгружаем локацию
        this.locationInputElement.value = freelancer.location;
        //Подгружаем навыки
        this.skillsInputElement.value = freelancer.skills;
        //Подгружаем информацию
        this.infoInputElement.value = freelancer.info;

        for (let i = 0; i < this.levelSelectElement.options.length; i++) {
            if (this.levelSelectElement.options[i].value === freelancer.level) {
                this.levelSelectElement.selectedIndex = i;
            }
        }
    }

    async updateFreelancer(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {

            //Отредактированные данные фрилансера
            const changedData = {};

            if (this.nameInputElement.value !== this.freelancerOriginalData.name) {
                changedData.name = this.nameInputElement.value;
            }
            if (this.lastNameInputElement.value !== this.freelancerOriginalData.lastName) {
                changedData.lastName = this.lastNameInputElement.value;
            }
            if (this.emailInputElement.value !== this.freelancerOriginalData.email) {
                changedData.email = this.emailInputElement.value;
            }
            if (this.educationInputElement.value !== this.freelancerOriginalData.education) {
                changedData.education = this.educationInputElement.value;
            }
            if (this.locationInputElement.value !== this.freelancerOriginalData.location) {
                changedData.location = this.locationInputElement.value;
            }
            if (this.skillsInputElement.value !== this.freelancerOriginalData.skills) {
                changedData.skills = this.skillsInputElement.value;
            }
            if (this.infoInputElement.value !== this.freelancerOriginalData.info) {
                changedData.info = this.infoInputElement.value;
            }
            if (this.levelSelectElement.value !== this.freelancerOriginalData.level) {
                changedData.level = this.levelSelectElement.value;
            }
            //Загрузка аватара
            if (this.avatarInputElement.files && this.avatarInputElement.files.length > 0) {
                changedData.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarInputElement.files[0]);
            }

            console.log(changedData)


            //Object.keys(changedData) - проверит по ключам есть ли в объекте поля name, lastName ид, то есть проверка
            //что у нас объект не пустой!!! и только тогда отправляем запрос с изменениями на бэкенд!!!

            if (Object.keys(changedData).length > 0) {
                //request
                const response = await FreelancersService.updateFreelancer(this.freelancerOriginalData.id, changedData);

                if (response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/freelancers/view?id=' + this.freelancerOriginalData.id);
            }

        }
    }
}