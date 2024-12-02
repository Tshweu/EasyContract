import { DateTime } from "luxon";

export interface Template {
    id?: number;
    title: string;
    terms: string;
    date: string;
    version: number;
    userId: number;
}
