function getLastMonths(date, qtdLastMonths) {
    const result = [];
  
    for (let i = 1; i <= qtdLastMonths; i++) {
      const currentDate = new Date(date);
      
      // Obtém o primeiro dia do mês atual
      currentDate.setDate(1);
  
      // Retrocede para o primeiro dia do mês anterior
      currentDate.setMonth(currentDate.getMonth() - i);
  
      const firstDayOfMonth = new Date(currentDate);
      const lastDayOfMonth = new Date(currentDate);
  
      // Obtém o último dia do mês atual
      lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
      lastDayOfMonth.setDate(0);
  
      // Formata as datas no formato "yyyy-mm-dd"
      const formattedFirstDay = formatDateToYYYYMMDD(firstDayOfMonth);
      const formattedLastDay = formatDateToYYYYMMDD(lastDayOfMonth);
  
      result.push({
        since: formattedFirstDay,
        until: formattedLastDay
      });
    }
  
    return result;
  }
  
  function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  
module.exports = {formatDateToYYYYMMDD, getLastMonths}