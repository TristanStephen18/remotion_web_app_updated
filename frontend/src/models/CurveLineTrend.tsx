type CurveLineData = {
    label: number;
    value: number;
}

export interface CurveLineTrendDataset {
    title: string;
    subtitle: string;
    data: CurveLineData[],
    dataType: string;
}