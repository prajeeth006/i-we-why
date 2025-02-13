using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Crm2.Models;
using CashbackDetails = Frontend.Vanilla.ServiceClients.Services.Crm2.Models.CashbackDetails;

namespace Frontend.Vanilla.ServiceClients.Services.Crm2;

internal interface ICrmService
{
    Task<CashbackDetails> GetCashbackAsync(CancellationToken cancellationToken);
    Task<CashbackDetailsV2> GetCashbackV2Async(CancellationToken cancellationToken);
    Task<IReadOnlyList<Bonus>> GetOfferedBonusesAsync(ExecutionMode mode);
    Task<WeeklyPokerPoints> GetCurrentWeekPokerPointsAsync(CancellationToken cancellationToken);
    Task<MLifeProfile> GetMLifeProfileAsync(CancellationToken cancellationToken);
    Task<bool> UpdateBonusTncAcceptanceAsync(BonusTncAcceptance bonusTncAcceptance, CancellationToken cancellationToken);
    Task<bool> DropBonusOfferAsync(DropBonusOffer dropBonusOffer, CancellationToken cancellationToken);
}
