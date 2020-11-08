import AuthService from '../core/user/AuthService.js';

$(document).ready(function() {
    $("#login-form").submit(function (e) {
        e.preventDefault();
        AuthService.instance.login($(this).serialize()).then((user) => {
            if (user != null) {
                window.location = user.isadmin ? "/admin" : "/user";
            } else
                $(this).find('.error').html('Неверный логин или пароль').removeClass('uk-hidden')
        });
    });
});