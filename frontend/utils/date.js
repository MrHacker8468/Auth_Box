export const formatDate = (dateString) => {
    console.log(dateString)
    const date = new Date(dateString);
    console.log(date)

    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    return date.toLocalString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};
