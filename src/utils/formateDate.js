
export const formatDisplayDate = (dateString) => {
if (!dateString) return "";
if (dateString < 9){
    try {
        const [year, month, day] = dateString.split("-");
        const date = `${day}/${month}/${year}`;
        return date
    } catch (e) {
        console.error("Erro ao formatar data:", dateString, e);
        return dateString;
    }
} else {
    try {
        const date = dateString.split("T")[0];
        const [year, month, day] = date.split("-");
        const dateMask = `${day}/${month}/${year}`;
        return dateMask
    }catch (e) {
        console.error("Erro ao formatar data:", dateString, e);
        return dateString;
    }

}
};