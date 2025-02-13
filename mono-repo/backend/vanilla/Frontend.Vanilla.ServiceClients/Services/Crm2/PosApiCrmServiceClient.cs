using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm2.Models;
using CashbackDetails = Frontend.Vanilla.ServiceClients.Services.Crm2.Models.CashbackDetails;
using IPosApiDataCache = Frontend.Vanilla.ServiceClients.Infrastructure.IPosApiDataCache;
using PosApiDataType = Frontend.Vanilla.ServiceClients.Infrastructure.PosApiDataType;

namespace Frontend.Vanilla.ServiceClients.Services.Crm2;

internal sealed class PosApiCrmServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache, IPosApiCrmService crmService, ICurrentUserAccessor currentUserAccessor)
    : ICrmServiceClient
{
    public Task<CashbackDetails> GetCashbackAsync(CancellationToken cancellationToken)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.Crm.LoyaltyCashback)
        {
            Authenticate = true,
        };

        return restClient.ExecuteAsync<CashbackDetails>(request, cancellationToken);
    }

    public Task<CashbackDetailsV2> GetCashbackV2Async(CancellationToken cancellationToken)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.Crm.LoyaltyCashbackV2)
        {
            Authenticate = true,
            Headers =
            {
                { PosApiHeaders.ProductId, "CASINO" },
            },
        };

        return restClient.ExecuteAsync<CashbackDetailsV2>(request, cancellationToken);
    }

    public Task<IEnumerable<Bonus>> GetBonusesAsync(CancellationToken cancellationToken, DateTime? fromDate = null, DateTime? toDate = null)
    {
        var from = fromDate?.ToString("u") ?? "";
        var to = toDate?.ToString("u") ?? "";

        return cache.GetOrCreateAsync(ExecutionMode.Async(cancellationToken),
            PosApiDataType.User,
            $"GetBonuses-{from}-{to}",
            async () =>
            {
                var url = new UriBuilder()
                    .AppendPathSegment(PosApiServiceNames.Crm)
                    .AppendPathSegment("Bonuses")
                    .AddQueryParameters(new List<(string name, string value)>
                    {
                        ("fromDate", from),
                        ("toDate", to),
                    })
                    .GetRelativeUri();

                var request = new PosApiRestRequest(url)
                {
                    Authenticate = true,
                };
                var result = await restClient.ExecuteAsync<BonusDto>(request, cancellationToken);

                return result.IssuedBonuses
                    .Select(b => new
                    {
                        Status = Enum.IsDefined(typeof(BonusStatus), b.BonusStatusId) ? (BonusStatus)b.BonusStatusId : BonusStatus.Unknown, b.IsBonusActive,
                    })
                    .Select(o => new Bonus
                    {
                        BonusStatusVanilla = Convert(o.Status, o.IsBonusActive),
                    });
            });
    }

    public Task<IReadOnlyList<Bonus>> GetOfferedBonusesAsync(ExecutionMode mode)
    {
        return cache.GetOrCreateAsync(mode,
            PosApiDataType.User,
            "GetOfferedBonuses",
            async () =>
            {
                var request = new PosApiRestRequest(PosApiEndpoint.Crm.BonusOffers)
                {
                    Authenticate = true,
                };
                var result = await restClient.ExecuteAsync<BonusOffersResponseDto>(mode, request);

                return (IReadOnlyList<Bonus>)result.BonusOffers.ConvertAll(o => new Bonus
                {
                    BonusStatusVanilla = o.IsTncAccepted ? BonusStatusVanilla.Accepted : BonusStatusVanilla.New,
                    BonusOfferType = Enum.IsDefined(typeof(BonusOfferType), o.BonusTypeId) ? (BonusOfferType)o.BonusTypeId : BonusOfferType.Unknown,
                    BonusCode = o.BonusCode,
                    AccountCurrencyCode = o.BonusAccountCurrencyCode,
                    BonusOfferMaxAmount = string.IsNullOrEmpty(o.BonusAccountCurrencyCode) ? o.MaxBonusRuleAmount : o.MaxBonusAccountAmount,
                });
            });
    }

    public Task<WeeklyPokerPoints> GetCurrentWeekPokerPointsAsync(CancellationToken cancellationToken)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.Crm.PokerWeeklyPoints)
        {
            Authenticate = true,
        };

        return restClient.ExecuteAsync<WeeklyPokerPoints>(request, cancellationToken);
    }

    public Task<MLifeProfile> GetMLifeProfileAsync(CancellationToken cancellationToken)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.Crm.LoyaltyProfileMlife)
        {
            Authenticate = true,
        };

        return restClient.ExecuteAsync<MLifeProfile>(request, cancellationToken);
    }

    public Task UpdateBonusTncAcceptanceAsync(BonusTncAcceptance bonusTncAcceptance, CancellationToken cancellationToken)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.Crm.UpdateBonusTncAcceptance, HttpMethod.Post)
        {
            Authenticate = true,
            Content = bonusTncAcceptance,
        };

        return restClient.ExecuteAsync(request, cancellationToken);
    }

    public Task DropBonusOfferAsync(DropBonusOffer dropBonusOffer, CancellationToken cancellationToken)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.Crm.DropBonusOffer, HttpMethod.Post)
        {
            Authenticate = true,
            Content = dropBonusOffer,
        };

        return restClient.ExecuteAsync(request, cancellationToken);
    }

    public async Task<IReadOnlyList<ContactCapability>> GetContactCapabilitiesAsync(CancellationToken cancellationToken, TimeSpan relativeExpiration)
    {
        var isRealMoneyPlayer = currentUserAccessor.User.IsRealMoneyPlayer();
        var loyaltyProfile = currentUserAccessor.User.Identity?.IsAuthenticated == true
            ? await crmService.GetBasicLoyaltyProfileAsync(cancellationToken)
            : null;

        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.Crm)
            .AppendPathSegment("ContactCapabilities")
            .AddQueryParametersIfValueNotWhiteSpace(
                ("lang", CultureInfo.CurrentCulture.Name),
                ("loyaltyCategory", loyaltyProfile?.Category),
                ("realPlayer", isRealMoneyPlayer ? "true" : null))
            .GetRelativeUri();

        return await cache.GetOrCreateAsync(ExecutionMode.Async(cancellationToken),
            PosApiDataType.Static,
            url.ToString(),
            async () =>
            {
                var request = new PosApiRestRequest(url);

                var result = await restClient.ExecuteAsync<ContactCapabilities>(request, cancellationToken);

                return result.Capabilities;
            }, relativeExpiration: relativeExpiration);
    }

    public async Task<IReadOnlyList<ContactAvailability>> GetContactAvailabilitiesAsync(
        CancellationToken cancellationToken,
        string webPageId,
        TimeSpan relativeExpiration)
    {
        Guard.NotWhiteSpace(webPageId, nameof(webPageId));

        var loyaltyProfile = currentUserAccessor.User.Identity?.IsAuthenticated == true
            ? await crmService.GetBasicLoyaltyProfileAsync(cancellationToken)
            : null;

        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.Crm).AppendPathSegment("ContactAvailabilities")
            .AddQueryParametersIfValueNotWhiteSpace(
                ("lang", CultureInfo.CurrentCulture.Name),
                ("webPageId", webPageId),
                ("loyaltyCategory", loyaltyProfile?.Category))
            .GetRelativeUri();

        return await cache.GetOrCreateAsync(ExecutionMode.Async(cancellationToken),
            PosApiDataType.Static,
            url.ToString(),
            async () =>
            {
                var request = new PosApiRestRequest(url);

                var result = await restClient.ExecuteAsync<ContactAvailabilities>(request, cancellationToken);

                return result.Availabilities;
            }, relativeExpiration: relativeExpiration);
    }

    private static BonusStatusVanilla Convert(BonusStatus status, bool isActive)
    {
        if (status is BonusStatus.Released or BonusStatus.Exhausted or BonusStatus.Expired or BonusStatus.DroppedOut or BonusStatus.Cs)
        {
            return BonusStatusVanilla.Closed;
        }

        return isActive ? BonusStatusVanilla.Active : BonusStatusVanilla.Waiting;
    }
}
