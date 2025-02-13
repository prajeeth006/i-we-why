using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.SignUpBonuses;

namespace Frontend.Vanilla.Features.TrackerId;

/// <summary>
/// Gets trackerId from URL or cookie if it's associated with a valid bonus.
/// </summary>
internal interface ISignUpBonusResolver
{
    int? GetBonusTrackerId(bool includeCookie);
    Task<int?> GetBonusTrackerIdAsync(bool includeCookie, CancellationToken cancellationToken);
    Task<int?> GetBonusTrackerIdAsync(ExecutionMode mode, bool includeCookie);
    SignUpBonusFlowContent GetBonusContentFlow(bool includeCookie);
    Task<SignUpBonusFlowContent> GetBonusContentFlowAsync(ExecutionMode mode, bool includeCookie);
}

internal abstract class SignUpBonusResolverBase : ISignUpBonusResolver
{
    public abstract Task<int?> GetBonusTrackerIdAsync(ExecutionMode mode, bool includeCookie);

    int? ISignUpBonusResolver.GetBonusTrackerId(bool includeCookie)
        => ExecutionMode.ExecuteSync(GetBonusTrackerIdAsync, includeCookie);

    Task<int?> ISignUpBonusResolver.GetBonusTrackerIdAsync(bool includeCookie, CancellationToken cancellationToken)
        => GetBonusTrackerIdAsync(ExecutionMode.Async(cancellationToken), includeCookie);

    public abstract Task<SignUpBonusFlowContent> GetBonusContentFlowAsync(ExecutionMode mode, bool includeCookie);

    public SignUpBonusFlowContent GetBonusContentFlow(bool includeCookie)
        => ExecutionMode.ExecuteSync(GetBonusContentFlowAsync, includeCookie);
}

internal sealed class SignUpBonusResolver(ICurrentUserAccessor currentUserAccessor, ITrackerIdResolver trackerIdResolver, IPosApiCrmServiceInternal posApiCrmService)
    : SignUpBonusResolverBase
{
    public override async Task<int?> GetBonusTrackerIdAsync(ExecutionMode mode, bool includeCookie)
    {
        var trackerIdString = GetTrackerId(includeCookie);

        if (!int.TryParse(trackerIdString, out var trackerId))
            return null;

        var bonusExists = await posApiCrmService.BonusExistsAsync(mode, trackerId, SignUpBonusStages.Landing);

        return bonusExists ? trackerId : null;
    }

    public override async Task<SignUpBonusFlowContent> GetBonusContentFlowAsync(ExecutionMode mode, bool includeCookie)
    {
        var trackerIdString = GetTrackerId(includeCookie);

        if (!int.TryParse(trackerIdString, out var trackerId))
            return new SignUpBonusFlowContent();

        var response = await posApiCrmService.GetBonusFlowContentAsync(mode, trackerId, SignUpBonusStages.Landing);

        return response;
    }

    private string? GetTrackerId(bool includeCookie)
    {
        if (currentUserAccessor.User.Identity?.IsAuthenticated is true)
            return null; // This is sign-up bonus, so user can't be already registered

        var trackerIdString = trackerIdResolver.Resolve(includeCookie);

        if (trackerIdString == null)
            return null;

        return trackerIdString;
    }
}
