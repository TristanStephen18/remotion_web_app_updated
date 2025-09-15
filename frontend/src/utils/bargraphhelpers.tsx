export const calculateDurationBarGraph = (numberofbars: number) => {
  let incrementer = 3;
  if (numberofbars > 5) {
    incrementer = 2;
  }

  const TotalDurationSeconds = numberofbars + incrementer;
  return TotalDurationSeconds;
};

export const titleAndSubtitleFontSizeIndicator = (title: string)=> {
    //34 = default
    //34 > decrease
    //34 < default, 34 is the baseline string length for the title

    if(title.length <= 34){
        return {
            titlefontsize: 78,
            subtitlefontsize: 48,
        }
    }else if(title.length > 34 && title.length < 45){
        return {
            titlefontsize: 60,
            subtitlefontsize: 38,
        }
    }else{
        return {
            titlefontsize: 50,
            subtitlefontsize: 30,
        }
    }
}
