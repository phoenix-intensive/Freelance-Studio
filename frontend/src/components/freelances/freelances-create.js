import {HttpUtils} from "../../utils/http-utils.js";
import {AuthUtils} from "../../utils/auth-utils.js";
import {FileUtils} from "../../utils/file-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {FreelancersService} from "../../services/freelancers-service.js";


export class FreelancesCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        document.getElementById('saveButton').addEventListener('click', this.saveFreelancer.bind(this));

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


    async saveFreelancer(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {

            const createData = {
                name: this.nameInputElement.value,
                lastName: this.lastNameInputElement.value,
                email: this.emailInputElement.value,
                level: this.levelSelectElement.value,
                education: this.educationInputElement.value,
                location: this.locationInputElement.value,
                skills: this.skillsInputElement.value,
                info: this.infoInputElement.value
            };

            //Загрузка аватара
            if (this.avatarInputElement.files && this.avatarInputElement.files.length > 0) {
                createData.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarInputElement.files[0]);
            }

            //request
            const response = await FreelancersService.createFreelancer(createData);

            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/freelancers/view?id=' + response.id);

        }
    }
}