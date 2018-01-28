// @ts-nocheck
app();
function app() {

    $.getJSON('app.json', function (res) {
        window.location.href = res.indexPage;
    })

}