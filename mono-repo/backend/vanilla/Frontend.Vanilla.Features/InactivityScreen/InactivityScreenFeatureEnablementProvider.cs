using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.InactivityScreen;

internal sealed class InactivityScreenFeatureEnablementProvider(IInactivityScreenConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.InactivityScreen;
    public string Source => $"{InactivityScreenConfiguration.FeatureName}.{nameof(config.Mode)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(!string.IsNullOrWhiteSpace(config.Mode)));
}
