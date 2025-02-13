using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Affordability;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.Affordability;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class AffordabilityDslProvider(
    Func<IAffordabilityConfiguration> affordabilityConfiguration,
    Func<IPosApiResponsibleGamingServiceInternal> posApiResponsibleGamingService)
    : IAffordabilityDslProvider
{
    private const string AffordabilityLevelPrefix = "LEVEL";
    private readonly Lazy<IAffordabilityConfiguration> affordabilityConfiguration = affordabilityConfiguration.ToLazy();
    private readonly Lazy<IPosApiResponsibleGamingServiceInternal> posApiResponsibleGamingService = posApiResponsibleGamingService.ToLazy();

    public async Task<string> LevelAsync(ExecutionMode mode)
    {
        var snapshotDetails = await GetAffordabilitySnapshotDetailsAsync(mode);
        var affordabilityLevel = snapshotDetails.AffordabilityStatus
            .ToUpperInvariant()
            .Replace(AffordabilityLevelPrefix, string.Empty);

        return affordabilityLevel;
    }

    public async Task<string> EmploymentGroupAsync(ExecutionMode mode)
    {
        var snapshotDetails = await GetAffordabilitySnapshotDetailsAsync(mode);

        return snapshotDetails.EmploymentGroup;
    }

    private async Task<AffordabilitySnapshotDetailsResponse> GetAffordabilitySnapshotDetailsAsync(ExecutionMode mode)
    {
        var isEnabled = await affordabilityConfiguration.Value.IsEnabledCondition.EvaluateAsync(mode);

        if (!isEnabled)
        {
            return new AffordabilitySnapshotDetailsResponse();
        }

        var token = mode.AsyncCancellationToken ?? CancellationToken.None;

        var snapshotDetails = await posApiResponsibleGamingService.Value.GetAffordabilitySnapshotDetailsAsync(token);

        return snapshotDetails;
    }
}
