using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.PlayerGamingDeclaration;

internal sealed class PlayerGamingDeclarationFeatureEnablementProvider(IPlayerGamingDeclarationConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.PlayerGamingDeclaration;
    public string Source => $"{PlayerGamingDeclarationConfiguration.FeatureName}.{nameof(config.IsEnabledCondition)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        config.IsEnabledCondition.EvaluateForClientAsync(cancellationToken);
}
