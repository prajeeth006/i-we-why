using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.UserFlags;

internal sealed class UserFlagsFeatureEnablementProvider(IUserFlagsConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.UserFlags;
    public string Source => $"{UserFlagsConfiguration.FeatureName}.{nameof(config.IsEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.IsEnabled));
}
