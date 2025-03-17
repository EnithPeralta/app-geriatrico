import moment from "moment-timezone";

function formatFecha() {
    return moment().tz("America/Bogota").format("DD/MM/YYYY");
}


export { formatFecha };