type CardProps  = {
    label: string;
    value: string;
    color: string;  
}

type CardData = {
    front: CardProps;
    back: CardProps;
}

export interface KpiFlipData {
    title: string;
    subtitle: string;
    cardsData: CardData[];
    cardLabelFontSize: number;
    valueFontSize: number;
    cardLabelColor: string;
    cardColorBack: string;
    cardColorFront: string;
    cardBorderColor: string;
}
