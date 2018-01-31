$(() => {
    let dealing = false;
    $('#create-btn').on('click', function() {
        if (dealing) return;
        dealing = true;
        $.post('/nactive/mum/create-goods', {
            password: $('#password').val(),
        }).then((res) => {
            if (res.success) {
                alert(res.message);
            } else {
                alert(res.message);
            }
            dealing = false;
        });
    });

    $('#delete-btn').on('click', function() {
        if (dealing) return;
        dealing = true;
        $.post('/nactive/mum/delete-goods', {
            password: $('#password').val(),
        }).then((res) => {
            if (res.success) {
                alert(res.message);
            } else {
                alert(res.message);
            }
            dealing = false;
        });
    });

    $('#update-btn').on('click', function() {
        if (dealing) return;
        dealing = true;
        $.post('/nactive/mum/update-goods', {
            password: $('#password').val(),
        }).then((res) => {
            if (res.success) {
                alert(res.message);
            } else {
                alert(res.message);
            }
            dealing = false;
        });
    });
});
