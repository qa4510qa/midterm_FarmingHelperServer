const AppConfig = require('./AppConfig.const');

module.exports = function(){
const fs = require('fs');
let raw_data_Climate=[];
let future_weather =[];
return(readfile_Climate());


function readfile_Climate(){ //read future weather 
    raw_data_Climate = fs.readFileSync(AppConfig.CLIMATE_DATA_PATH, {encoding: 'utf8'}).split("\n");
    for(let i=0;i<raw_data_Climate.length;i++){   
        future_weather[i]=raw_data_Climate[i].split(",");
    }
    future_weather.pop();
    for(let i=1;i<future_weather.length;i++){
        for(let j=1;j<=4;j++){
        future_weather[i][j]=parseFloat(future_weather[i][j]);
        }
    } 
    future_weather[0][4] = future_weather[0][4].substring(0,4);
    return({"future_weather":future_weather})
}
}