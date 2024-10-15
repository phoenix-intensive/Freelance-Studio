import {HttpUtils} from "../../utils/http-utils.js";
import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";
import {UrlUtils} from "../../utils/url-utils.js";
import {FreelancersService} from "../../services/freelancers-service.js";

export class FreelancesView {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        //Достаем id пользователя из url адреса
        const id = UrlUtils.getUrlParam('id');

        if (!id) {
            return this.openNewRoute('/');
        }

        //Вставляем на кнопки Редактировать и Удалить фрилансера конкректный адрес
        document.getElementById('edit-link').href = '/freelancers/edit?id=' + id;
        document.getElementById('delete-link').href = '/freelancers/delete?id=' + id;


        this.getFreelancer(id).then();
    }

    async getFreelancer(id) {
        //request
        const response = await FreelancersService.getFreelancer(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showFreelancer(response.freelancer);
    }


    showFreelancer(freelancer) {
        //Подгружаем аватар фрилансера по нужному пути
        if (freelancer.avatar) {
            document.getElementById('avatar').src = config.host + freelancer.avatar;
        }
        //Подгружаем ФИО
        document.getElementById('name').innerText = freelancer.name + ' ' + freelancer.lastName;
        //Подгружаем уровень знаний
        document.getElementById('level').innerHTML = CommonUtils.getLevelHtml(freelancer.level);
        //Подгружаем email
        document.getElementById('email').innerText = freelancer.email;
        //Подгружаем образование
        document.getElementById('education').innerText = freelancer.education;
        //Подгружаем локацию
        document.getElementById('location').innerText = freelancer.location;
        //Подгружаем навыки
        document.getElementById('skills').innerText = freelancer.skills;
        //Подгружаем информацию
        document.getElementById('info').innerText = freelancer.info;
        //Подгружаем дату добавление фрилансера на платформу
        if (freelancer.createdAt) {
            const date = new Date(freelancer.createdAt)
            document.getElementById('created').innerText = date.toLocaleString('ru-RU');
        }
    }
}