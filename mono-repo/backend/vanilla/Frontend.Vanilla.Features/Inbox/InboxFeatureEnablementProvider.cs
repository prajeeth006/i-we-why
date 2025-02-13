using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.Inbox;

internal sealed class InboxFeatureEnablementProvider(IInboxConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.Inbox;
    public string Source => $"{InboxConfiguration.FeatureName}.{nameof(config.Enabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.Enabled));
}
