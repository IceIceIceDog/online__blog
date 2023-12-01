const dateTemplates = {
    hours: {
        one: 'час назад',
        twoAndMore: 'часа назад',
        fiveAndMore: 'часов назад'
    },

    days: {
        one: 'день назад',
        twoAndMore: 'дня назад',
        fiveAndMore: 'дней назад'
    }
}


export const getDateFormat = (date) => {
   const responseTime = date.getTime();
   const currentTime = Date.now();
   
   const daysdifferent = Math.trunc((currentTime - responseTime) / (1000 * 3600 * 24));

   const hoursdifferent = Math.trunc(daysdifferent * 24);


   if (daysdifferent > 0 && daysdifferent <= 9) {
     
   if (daysdifferent === 1) return `1 ${dateTemplates.days.one}`;
            
   if(daysdifferent > 1 && daysdifferent < 5) return `${daysdifferent} ${dateTemplates.days.twoAndMore}`;
            
   if (daysdifferent > 5 && daysdifferent <= 9) return `${daysdifferent} ${dateTemplates.days.fiveAndMore}`;
              
   }
    
    if (daysdifferent <= 0){
       
            if (hoursdifferent < 1)  return 'недавно';
            
            if (hoursdifferent === 1)  return `1 ${dateTemplates.hours.one}`;
               
            if (hoursdifferent > 1 && hoursdifferent < 5) return `${hoursdifferent} ${dateTemplates.hours.twoAndMore}`;
                
            if (hoursdifferent > 5 && daysdifferent <= 9) return `${hoursdifferent} ${dateTemplates.days.fiveAndMore}`;
                
    }
       
    return date.toLocaleDateString();

}