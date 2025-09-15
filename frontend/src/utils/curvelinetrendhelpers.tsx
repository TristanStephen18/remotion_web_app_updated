export const durationCalculatorForCurveLineAnimationSpeeds =  (speed: string)=>{
    if(speed === "slow"){
        return 17;
    }else if(speed === "normal"){
        return 13;
    }else{
        return 8;
    }
}

// export const curvelineTrendFontsSizeIndicator = (titlesize: number) => {
//     //unneccessary
// }