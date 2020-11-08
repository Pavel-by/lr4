import AuthService from "../core/user/AuthService.js";

$(document).ready(async function() {
    let user = await AuthService.instance.user();

    $("#loading-section").addClass("uk-hidden");

    if (user == null)
        $('#unaithorized-section').removeClass('uk-hidden');
    else {
        $('.user-name').html(user.name);
        $('#authorized-section a').attr('href', user.isadmin ? '/admin' : '/user');
        $('#authorized-section').removeClass('uk-hidden');
    }
});