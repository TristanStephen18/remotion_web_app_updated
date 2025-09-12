interface Segments {
    text: string;
    start_time: number;
    end_time: number;
    speaker: {
        id: string;
        name: string;
    },
    words: {text: string;
    start_time: number;
    end_time: number;}[];
}

export interface ChatJson {
    language_code: string;
    segments: Segments[];
}


