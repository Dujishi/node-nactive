const formatTime = (time) => {
    const date = new Date(time);
    const Y = `${date.getFullYear()}-`;
    const M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`;
    const D = `${date.getDate()} `;

    return Y + M + D;
};

module.exports = formatTime;
