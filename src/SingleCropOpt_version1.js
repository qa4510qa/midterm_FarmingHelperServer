// const start_year=2019; //yyyy   //選單方式
// const start_month=3; //mm
// const start_date=5; //dd
// const end_year=2019; 
// const end_month=5; 
// const end_date=31;
// let id_Crop = 0; //0=菠菜、1=作物1、2=作物2
// const p=1,t=1,w=1,s=1;//每組數據的權重 先分要考慮=1跟不考慮=0、動態分配權重

const fs = require('fs');


module.exports = function (start_year,start_month,start_date,end_year,end_month,end_date,id_Crop,p,t,w,s){
    let raw_data_Climate=[];
    let raw_data_Crop=[];
    let Crop=[];
    let Crop_name = ["spinach","tonghao","jyelan","bokchoy_summer","bokchoy_winter","huangong","shian_tsai","leaves lettuce","head lettuce"];
    const starttime=[[start_year.toString(),start_month.toString(),start_date.toString()].join('/')];//將開始時間結合成為字串
    const endtime=[[end_year.toString(),end_month.toString(),end_date.toString()].join('/')];//將結束時間結合成為字串
    let future_weather =[];
    let future_weather_arranged=[];//整理過後農地空閒時間的氣象資料，但日期產生時要變成字串
    let Compare = []; //array(??x5)
    let total_score = [];
    let max_score = 0;
    let max_date = 1;
    let allseed = [];
    let disasterP=[];
    let disasterW=[];

    
    this.singleCropCal = function(){
        readfile_Climate();
        readfile_Crop();
        arrange_future_weather();
        for(let i=0;i<future_weather_arranged.length-Crop.length+1;i++){ //可跑的次數
            disasterP[i]=0;
            disasterW[i]=0;
            Crop_compare(i);
            Crop_calculate(i,Compare);
        }
        console.log(disasterP.length);

        x=2*(p+t+w+s)*(Crop.length-1);
        // console.log(["max_scores",x]);//滿分的分數
        allseed_days();
        return {
            "Cropname":Crop_name[id_Crop],   
            "availDays":future_weather_arranged.length-1,
            "growth_days":Crop.length-1,
            "max_scores":x,
            "allseed":allseed,
        }
    }

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
    }

    function readfile_Crop(){ //讀各種作物 0=菠菜、1=茼蒿、2=芥藍、3=夏小白菜、4=冬小白菜、5=皇宮菜 、6=莧菜、7=葉萵苣、8=結球萵苣
        path_Crop = path_Crop = ["./CropData/spinach.csv","./CropData/tong-hao.csv","./CropData/jye-lan.csv","./CropData/bok_choy_summer.csv","./CropData/bok_choy_winter.csv","./CropData/huan_gong.csv","./CropData/shian_tsai.csv","./CropData/leaves_lettuce.csv","./CropData/lettuce.csv"];
        raw_data_Crop[id_Crop] = fs.readFileSync(path_Crop[id_Crop], {encoding: 'utf8'}).split("\n");
        for(let i=0;i<raw_data_Crop[id_Crop].length;i++){  
            Crop[i]=raw_data_Crop[id_Crop][i].split(",");
        }
        Crop.pop();
        Crop[0].splice(11,4);
        for(let i=1;i<Crop.length;i++){
            Crop[i].splice(11,4);
            for(let j=0;j<=10;j++){
              Crop[i][j]=parseFloat(Crop[i][j]);
            }
        }
        // console.log(["growth_days",Crop.length-1]); //生長期
    }
    
    function arrange_future_weather(){   //arrange future weather 
    for(let i=0;i<=future_weather.length-1;i++){
        if(starttime==future_weather[i][0]){
            for(let j=0;j<=future_weather.length-1;j++){
                if(endtime==future_weather[j][0]){
                    future_weather_arranged=[future_weather[0]].concat(future_weather.slice(i,j+1));
                    break;
                }
            }
        }
    }
    if(future_weather_arranged.length===0){
        console.log("農地閒置日期輸入錯誤");
        return 0;
    }
    }
    
    function Crop_compare(fut_strd){ //不同作物比較後分數 check
        for(j = 1;j <= Crop.length-1; j++){
            Compare[0]=["Date","T_score","P_score","S_score","W_score"];
            Compare[j]=[j,0,0,0,0];
            if(future_weather_arranged[j+fut_strd][1]>Crop[j][1]){//>T1
                Compare[j][1]= 0;
            }
            else if(future_weather_arranged[j+fut_strd][1]<=Crop[j][1]&&future_weather_arranged[j+fut_strd][1]>Crop[j][2]){//between T1 and T2 
                Compare[j][1]= 1;
            }
            else if(future_weather_arranged[j+fut_strd][1]<=Crop[j][2]&&future_weather_arranged[j+fut_strd][1]>Crop[j][3]){//between T2 and T3
                Compare[j][1]= 2;
            }
            else if(future_weather_arranged[j+fut_strd][1]<=Crop[j][3]&&future_weather_arranged[j+fut_strd][1]>Crop[j][4]){//between T3 and T4
                Compare[j][1]= 1;
            }
            else{//<T4 //T1>T2>T3>T4
                Compare[j][1]= 0;
            } 
            if(future_weather_arranged[j+fut_strd][2]<=Crop[j][5]&&future_weather_arranged[j+fut_strd][2]>=Crop[j][6]){//between Pmax and Pmin，先不考慮需水下限、入滲
                Compare[j][2]= 2;
            }
            else{
                Compare[j][2]= 0; disasterP[fut_strd]+=1;console.log( disasterP[fut_strd].tostring());
            }
            if(future_weather_arranged[j+fut_strd][3]<=Crop[j][7]&&future_weather_arranged[j+fut_strd][3]>=Crop[j][8]){//between Smax and Smin
                Compare[j][3]= 2;
            }
            else{
                Compare[j][3]= 0;   
            }
            if(future_weather_arranged[j+fut_strd][4]<=Crop[j][9]&&future_weather_arranged[j+fut_strd][3]>=Crop[j][10]){//between Wmax and Wmin
                Compare[j][4]= 2;
            }
            else{
                Compare[j][4]= 0;  disasterW[fut_strd]+=1;
            }
        }
    }
    
    function Crop_calculate(i,arr){ //計算個別總分數
        total_score[0]=["Date","T_score","P_score","S_score","W_score"];        
        total_score[i+1]=[i+1,0,0,0,0];
        for (let k = 1; k <= Crop.length-1; k++) {  
            total_score[i+1][1] += t*arr[k][1]; //第二行第一列為溫度總分
            total_score[i+1][2] += p*arr[k][2]; //第二行第二列為雨量總分
            total_score[i+1][3] += s*arr[k][3]; //第二行第三列為日照總分
            total_score[i+1][4] += w*arr[k][4]; //第二行第四列為風速總分 
            
        }
        return total_score;
    }
    
    function Crop_dates(total_score){ //算出最大總分時的日期
        for(let i=1;i<=future_weather_arranged.length-Crop.length+1;i++){
            let score = 0;
            for(let j=1;j<=4;j++){
                score+=total_score[i][j];
            }
            if(score>=max_score){
                max_score = score;
                max_date = i; //同分情況時該顯示何日期
            }
        }
        return [future_weather_arranged[max_date][0]] ;
    }
    
    function allseed_days(){ //得日期配總分之矩陣
        for(let i=1;i<=future_weather_arranged.length-Crop.length+1;i++){
            allseed[0] = ["Dates","total scores"];
            allseed[i] = [0,0];
            allseed[i][0] = future_weather_arranged[i][0];
            for(let j=1;j<=4;j++){
                allseed[i][1]+=total_score[i][j];
            }
            console.log(disasterP[i-1],disasterW[i-1]);
            allseed[i][1]*=Math.pow(0.3,disasterP[i-1]);
            allseed[i][1]*=Math.pow(0.4,disasterW[i-1]);

        }
        // console.log(allseed); 
    }
}