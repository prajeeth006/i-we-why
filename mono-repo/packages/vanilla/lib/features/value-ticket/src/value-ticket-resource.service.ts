import { Injectable, inject } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PayoutValueTicketRequest, PayoutValueTicketResponse, ValueTicketRequest, ValueTicketResponse } from './value-ticket.models';

@Injectable()
export class ValueTicketResourceService {
    private apiService = inject(SharedFeaturesApiService);

    getValueTicket(request: ValueTicketRequest): Observable<ValueTicketResponse> {
        return this.apiService.get('retail/valueticket', request).pipe(map((response: ValueTicketResponse) => response));
    }

    payoutValueTicket(request: PayoutValueTicketRequest): Observable<PayoutValueTicketResponse> {
        return this.apiService.post('retail/payoutvalueticket', request).pipe(map((response: PayoutValueTicketResponse) => response));
    }
}
