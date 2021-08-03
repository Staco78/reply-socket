interface wsMessageData<T = any> {
    type: 0 | 1;
    action?: string;
    id: string;
    data?: T;
    error?: string;
}