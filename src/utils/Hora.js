export const formatTo12Hour = (time) => {
    if (!time) return '';
    let [hour, minute] = time.split(':');
    let period = 'AM';

    hour = parseInt(hour, 10);
    if (hour >= 12) {
        period = 'PM';
        if (hour > 12) hour -= 12;
    } else if (hour === 0) {
        hour = 12;
    }

    return `${hour}:${minute} ${period}`;
};
