interface Content {
    text?: string | null | undefined;
    photo?: string | null | undefined;
}

export interface Post {
    _id?: Types.ObjectId;
    userId?: Types.ObjectId;
    title: string;
    content?: Content | null | undefined;
    updateHistory: string[];
}

export { }; 