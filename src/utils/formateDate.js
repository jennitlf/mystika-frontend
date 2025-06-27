export const formatDisplayDate = (dateString) => {
if (!dateString) return "";
try {
    const [year, month, day] = dateString.split("-");
    const date = `${day}/${month}/${year}`;
    return date
} catch (e) {
    console.error("Erro ao formatar data:", dateString, e);
    return dateString;
}
};