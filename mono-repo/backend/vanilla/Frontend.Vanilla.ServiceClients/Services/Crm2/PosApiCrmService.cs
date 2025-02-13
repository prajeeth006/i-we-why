using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Crm2.Models;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.ServiceClients.Services.Crm2;

internal sealed class PosApiCrmService(
    ICrmServiceClient crmServiceClient,
    ICurrentUserAccessor currentUserAccessor,
    ILogger<PosApiCrmService> log)
    : ICrmService
{
    public async Task<CashbackDetails> GetCashbackAsync(CancellationToken cancellationToken)
    {
        try
        {
            return currentUserAccessor.User.Identity?.IsAuthenticated == true ? await crmServiceClient.GetCashbackAsync(cancellationToken) : null;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "GetCashbackAsync failed");

            return null;
        }
    }

    public async Task<CashbackDetailsV2> GetCashbackV2Async(CancellationToken cancellationToken)
    {
        try
        {
            return currentUserAccessor.User.Identity?.IsAuthenticated == true ? await crmServiceClient.GetCashbackV2Async(cancellationToken) : null;
        }
        catch (PosApiException ex) when (ex.PosApiCode != 114)
        {
            log.LogError(ex, "GetCashbackV2Async failed");

            return null;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "GetCashbackV2Async general failure");

            return null;
        }
    }

    public async Task<IReadOnlyList<Bonus>> GetOfferedBonusesAsync(ExecutionMode mode)
    {
        try
        {
            return currentUserAccessor.User.Identity?.IsAuthenticated == true ? await crmServiceClient.GetOfferedBonusesAsync(mode) : Array.Empty<Bonus>();
        }
        catch (Exception ex)
        {
            log.LogError(ex, "GetOfferedBonusesAsync failed");

            return Array.Empty<Bonus>();
        }
    }

    public async Task<WeeklyPokerPoints> GetCurrentWeekPokerPointsAsync(CancellationToken cancellationToken)
    {
        try
        {
            return currentUserAccessor.User.Identity?.IsAuthenticated == true ? await crmServiceClient.GetCurrentWeekPokerPointsAsync(cancellationToken) : null;
        }
        catch (Exception ex)
        {
            log.LogInformation(ex, "GetCurrentWeekPokerPointsAsync failed");

            return null;
        }
    }

    public async Task<MLifeProfile> GetMLifeProfileAsync(CancellationToken cancellationToken)
    {
        try
        {
            return currentUserAccessor.User.Identity?.IsAuthenticated == true ? await crmServiceClient.GetMLifeProfileAsync(cancellationToken) : null;
        }
        catch (PosApiException paex) when (paex.PosApiCode.Equals(103))
        {
            log.LogInformation(paex, "MLife does not exists for given account");
        }
        catch (Exception ex)
        {
            log.LogError(ex, "GetMLifeRewardsAsync failed");
        }

        return null;
    }

    public async Task<bool> UpdateBonusTncAcceptanceAsync(BonusTncAcceptance bonusTncAcceptance, CancellationToken cancellationToken)
    {
        if (currentUserAccessor.User.Identity is not { IsAuthenticated: true })
            return false;

        try
        {
            await crmServiceClient.UpdateBonusTncAcceptanceAsync(bonusTncAcceptance, cancellationToken);

            return true;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "UpdateBonusTncAcceptanceAsync failed");

            return false;
        }
    }

    public async Task<bool> DropBonusOfferAsync(DropBonusOffer dropBonusOffer, CancellationToken cancellationToken)
    {
        if (currentUserAccessor.User.Identity is not { IsAuthenticated: true })
            return false;

        try
        {
            await crmServiceClient.DropBonusOfferAsync(dropBonusOffer, cancellationToken);

            return true;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "DropBonusOffer failed");

            return false;
        }
    }
}
