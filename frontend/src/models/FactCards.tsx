type Facts = {
    title: string;
    description: string;
}

type FactCardsEndopoint = {
    title: string;
    subtitle: string;
}

export interface FactCardsDataset {
    intro: FactCardsEndopoint,
    outro: FactCardsEndopoint,
    facts: Facts[]
}