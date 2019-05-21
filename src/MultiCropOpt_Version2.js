const data = require('./SingleCropOpt_version1');
// const start_year=2019;
// const start_month=3;
// const start_date=1;
// const end_year=2019;
// const end_month=5;
// const end_date=20;
// const id_Crop=[0,1,2];
// const p=[1,1,1];
// const t=[1,1,1];
// const w=[1,0,0];
// const s=[1,0,1];
// const cropPrice=[25,40,35];

module.exports = ({
  start_year,
  start_month,
  start_date,
  end_year,
  end_month,
  end_date,
  id_Crop,
  p,
  t,
  w,
  s,
  cropPrice,
  location
}) => {
  // console.log('lalala');
  let max_score=0;
  let max_sequence;
  let crop_name=["spinach","tonghao","jyelan","bokchoy_summer","bokchoy_winter","huangong"];
  let crop = [];
  console.log(start_year,
    start_month,
    start_date,
    end_year,
    end_month,
    end_date,
    id_Crop,
    p,
    t,
    w,
    s,
    cropPrice,
    location);
  id_Crop.map(element => {
    crop[element]=(new data(start_year,start_month,start_date,end_year,end_month,end_date,element,p[element],t[element],w[element],s[element]).singleCropCal()) //Why???!!!
  }); 
  let leftdays=crop[1].allseed.length+crop[1].growth_days-2;
  console.log(crop[1])
  opt_method(leftdays,0,0,0,[]);
  let new_maxscore=[max_score];
  sensitivity();
  max_score=0;
  opt_method(leftdays,0,0,0,[]);
  // console.log(max_sequence);
  for(let i=0;i<=Object.values(max_sequence).length-1;i++){
    new_maxscore[Object.values(max_sequence)[i][2]+1]="目前選定種植作物";
  }
  console.log("ans:",max_score,max_sequence,new_maxscore)
  return {
    "max_score":max_score,
    "max_sequence":max_sequence,
    "new_maxscore":new_maxscore,
  }


  function sensitivity(){ //敏感度分析
    for(let k=0;k<=cropPrice.length-1;k++){
      const record=max_score;
      for(let l=0;l<=999;l++){
        cropPrice[k]=(10*cropPrice[k]+1)/10;
        opt_method(leftdays,0,0,0,[]);
        if(new_maxscore[0]<max_score){
          new_maxscore[k+1]=cropPrice[k];
          cropPrice[k]=(10*cropPrice[k]-(l+1))/10;
          max_score=record;
          break;
        }
        if(l===999){
          cropPrice[k]-=100;
          new_maxscore[k+1]="不建議種植";

          max_score=record;
        }
      }
     }
     return new_maxscore;
  }
  
  function opt_method(leftday,score,second_start,order,seq){
    /*第一次幾種*/for(let tj=0;tj<=crop.length-1;tj++)/*第一次有幾種可以種*/{
      if(crop[tj]===undefined) continue;
      let leftdays0=leftday;
      leftdays0-=crop[tj].growth_days; //console.log(leftdays);
      if(leftdays0<=0){continue};//console.log(crop[tj].allseed.length);
    /*第一次幾天*/for(let j=second_start;j<=leftdays-crop[tj].growth_days/*第一種有幾天可以種*/;j++/*第一個要在哪天種*/){
        let score0=score;
        let sequence=Object.assign({},seq);      
        score0+=cropPrice[tj]*crop[tj].allseed[j+1][1]/crop[tj].max_scores;   
        for(let i=seq.length;i>order;i--){
          delete sequence.i.toString();
        }   
        sequence[order]=crop[tj].allseed[j+1].concat([tj]);
        if(max_score<score0){
          // console.log(max_sequence)
          max_sequence=sequence;
          max_score=score0;
        };
        opt_method(leftdays0,score0,second_start+j+crop[tj].growth_days,order+1,sequence);
    } 
    }
  }
 };
