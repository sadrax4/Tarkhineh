import * as moment from "jalali-moment";

export const getPersianDate = () => {
    return moment().locale('fa').format('YYYY/M/D');
}