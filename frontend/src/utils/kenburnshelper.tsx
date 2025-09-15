export const kenBurnsProportionHelper = (shape: string) => {
    switch(shape){
        case "large square":
            return {
                width: 0.90,
                height: 0.50
            }
        case "normal square":
            return {
                width: 0.76,
                height: 0.50
            }
        case "large rectangle":
            return {
                width: 0.90,
                height: 0.70
            }
        case "normal rectangle":
            return {
                width: 0.79,
                height: 0.61,
            }
        case "small rectangle":
            return {
                width: 0.60,
                height: 0.50
            }
        default:
            return {
                width: 0.75,
                height: 0.75
            }
    }
}

export const kenBurnsDurationCalculator = (size: number)=>{
    return size * 3;
}