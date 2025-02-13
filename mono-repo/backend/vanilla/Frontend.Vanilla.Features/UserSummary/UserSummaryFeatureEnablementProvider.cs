using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.UserSummary;

internal sealed class UserSummaryFeatureEnablementProvider(IUserSummaryConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.UserSummary;
    public string Source => $"{UserSummaryConfiguration.FeatureName}.{nameof(config.IsEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.IsEnabled));
}
