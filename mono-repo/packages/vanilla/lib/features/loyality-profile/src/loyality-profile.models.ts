export interface MlifeLoyalityProfile extends Record<string, string | number> {
    mlifeNo: number;
    tier: string;
    tierDesc: string;
    tierCredits: number;
}
