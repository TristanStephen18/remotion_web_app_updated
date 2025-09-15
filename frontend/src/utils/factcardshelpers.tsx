//1 sec is to 1 card in the video so create a function catches the pacing selectec by the user 
//maximum speed is 1 sec per card including the intro and outro
//always catch the length of the facts array then increment 2
//find the seconds pacing on super slow, slow, normal, fast and super fast

//super fast is 1 sec per card which means (facts.length + 2) * 1 including the intro and outro
//fast is 2secs per card which means (length + 2) * 2
//normal is 4 secs per card meaning (length + 2) * 4  
//slow is 6 secs per card meaning (length +2) * 6
//super slow 8 secs per card which means (length + 2) * 8
//notice the + 2 secs as the speed decreases. Inverted relationship

export const durationCalculatorforFactsCard = (size: number, pacing: string) => {
    size = size + 2;
    switch(pacing){
        case "slower":
            return size * 8;
        case "slow":
            return size * 6;
        case "normal":
            return size * 4;
        case "fast":
            return size * 2;
        default:
            return size;
    }
}


//dynamic calculator for title and subtitle fontsize
export const cardTitleFontSizeIndicator = (size: number) => {
    if(size <=16){
        return 74;
    }else if(size >= 17 && size <=27 ){
        return 71;
    }else{
        return 68;
    }
}

export const cardSubtitleFontSizeIndicator= (size: number)=>{
    if(size <= 89){
        return 57;
    }else{
        return 49;
    }
}