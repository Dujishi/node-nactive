$('#submit-over').on('click', () => {
    const password = $('#password-over').val();
    if (!password) {
        alert('请输入密码');
        return;
    }
    $.post('/nactive/avoidpolice/admin', {
        password,
    }, (res) => {
        if (res.success) {
            alert('ok');
        } else {
            alert(res.message);
        }
    });
});

$('#submit-code').on('click', () => {
    const code = $('#code').val();
    const phone = $('#phone').val();
    const password = $('#password-code').val();

    if (!code) {
        alert('请输入兑换码');
        return;
    }
    if (!phone) {
        alert('请输入手机号');
        return;
    }
    if (!password) {
        alert('请输入密码');
        return;
    }

    $.post('/nactive/avoidpolice/admin_send_code', {
        code,
        phone,
        password,
    }, (res) => {
        if (res.success) {
            alert('ok');
        } else {
            alert(res.message);
        }
    });
});
