// moment
import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");
const r = moment().endOf("day").fromNow();
console.log(r);
