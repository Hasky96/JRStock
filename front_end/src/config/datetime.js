import "moment/locale/ko";

const timeMark = (time) => {
  const moment = require("moment");
  const newTime = moment(time);
  if (time.length < 20) {
    return time;
  } else if (moment().diff(newTime) > 259200000) {
    return newTime.format("YYYY-MM-DD");
  } else {
    return moment(newTime, "YYYY.MM.DD.HH.mm.SS").locale("ko").fromNow();
  }
};

export { timeMark };
