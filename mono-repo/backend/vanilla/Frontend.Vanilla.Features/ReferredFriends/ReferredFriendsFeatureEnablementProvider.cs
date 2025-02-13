using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.ReferredFriends;

internal sealed class ReferredFriendsFeatureEnablementProvider(IReferredFriendsConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.ReferredFriends;
    public string Source => $"{ReferredFriendsConfiguration.FeatureName}.{nameof(config.IsEnabledCondition)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        config.IsEnabledCondition.EvaluateForClientAsync(cancellationToken);
}
