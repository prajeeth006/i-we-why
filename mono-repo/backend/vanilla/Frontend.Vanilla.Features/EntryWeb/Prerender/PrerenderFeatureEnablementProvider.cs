using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.EntryWeb.Prerender;

internal sealed class PrerenderFeatureEnablementProvider(IPrerenderConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.Prerender;
    public string Source => $"{PrerenderConfiguration.FeatureName}.{nameof(config.ReadyEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.ReadyEnabled));
}
