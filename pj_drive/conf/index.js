const config = require('../../config');

// PHP接口地址
const prefix = config.phpHost + '/travel';

module.exports = {
    index     : prefix + '/Data/index.php',
    places    : prefix + '/Data/places.php',
    signup    : prefix + '/Data/signup.php',
    state     : prefix + '/Data/state.php',
    subscribe : prefix + '/Data/subscribe.php',
    detail    : prefix + '/Data/detail.php',
    userlist  : prefix + '/Data/userlist.php',
    signin    : prefix + '/Data/signin.php',
    cache     : prefix + '/Data/cache.php',
    pageinfo  : prefix + '/Data/pageinfo.php',
    insurance : prefix + '/Data/insurance.php'
}