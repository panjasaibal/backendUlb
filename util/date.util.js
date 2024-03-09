const genrateTodayDate = ()=>{
    const date = new Date();
    return date.toLocaleDateString();
    
}

module.exports= genrateTodayDate;
