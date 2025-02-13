import { InjectionToken } from '@angular/core';

export interface JackpotWinnerEvent {
    winValue: string;
    currency: string;
}

export const PLAYER_GAME_JACKPOT_WIN = new InjectionToken<JackpotWinnerEvent>('vn-player-game-jackpot-win');
