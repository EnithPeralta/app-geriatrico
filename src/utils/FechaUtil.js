import moment from "moment-timezone";

function formatFecha() {
    return moment().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss")
}

export { formatFecha };
