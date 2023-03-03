import moment from "moment"
export const converDatetimeToString = (datetime) =>
{
    return moment(datetime).format('YYYY-MM-DD')
}