// 倒计时方法
const changeRestTime = () => {
    const $time = $('.time-text');

    setInterval(() => {
        const timeArr = $time.text().split(':');
        // console.log(timeArr);
        let hour = timeArr[0];
        let minut = timeArr[1];
        let second = timeArr[2];
        second = --second < 0 ? 59 : second;

        if (second < 10) {
            second = `0${second}`;
        }
        if (second == 59) {
            parseInt(--minut);
        }
        if (minut < 10 && minut >= 0) {
            minut = `0${parseInt(minut)}`;
        }
        if (minut < 0) {
            minut = 59;
            hour--;
        }
        if (hour < 10) {
            hour = `0${parseInt(hour)}`;
        }
        if (hour == 0 && minut == 0 && second == 0) {
            location.reload();
            return;
        }
        // console.log(`${hour}:${minut}:${second}`);
        $time.text(`${hour}:${minut}:${second}`);
    }, 1000);
};

export default changeRestTime;
