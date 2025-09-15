 type BarGraphData = {
    name: string;
    value: number;
}

export interface BarGraphDataset {
    title: string;
    subtitle: string;
    data: BarGraphData[],
}