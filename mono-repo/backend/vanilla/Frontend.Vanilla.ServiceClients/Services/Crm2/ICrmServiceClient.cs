using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Crm2.Models;

namespace Frontend.Vanilla.ServiceClients.Services.Crm2;

internal interface ICrmServiceClient
{
    Task<CashbackDetails> GetCashbackAsync(CancellationToken cancellationToken);
    Task<CashbackDetailsV2> GetCashbackV2Async(CancellationToken cancellationToken);

    Task<IEnumerable<Bonus>> GetBonusesAsync(CancellationToken cancellationToken, DateTime? fromDate = null, DateTime? toDate = null);

    Task<IReadOnlyList<Bonus>> GetOfferedBonusesAsync(ExecutionMode mode);
    Task<WeeklyPokerPoints> GetCurrentWeekPokerPointsAsync(CancellationToken cancellationToken);
    Task<MLifeProfile> GetMLifeProfileAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<ContactCapability>> GetContactCapabilitiesAsync(CancellationToken cancellationToken, TimeSpan relativeExpiration);
    Task<IReadOnlyList<ContactAvailability>> GetContactAvailabilitiesAsync(CancellationToken cancellationToken, string webPageId, TimeSpan relativeExpiration);
    Task UpdateBonusTncAcceptanceAsync(BonusTncAcceptance bonusTncAcceptance, CancellationToken cancellationToken);
    Task DropBonusOfferAsync(DropBonusOffer dropBonusOffer, CancellationToken cancellationToken);
}
