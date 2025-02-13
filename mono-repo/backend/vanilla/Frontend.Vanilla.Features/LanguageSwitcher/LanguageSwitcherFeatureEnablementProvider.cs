using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.LanguageSwitcher;

internal sealed class LanguageSwitcherFeatureEnablementProvider(ILanguageSwitcherConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.LanguageSwitcher;
    public string Source => $"{LanguageSwitcherConfiguration.FeatureName}.{nameof(config.IsEnabledDslExpression)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        config.IsEnabledDslExpression.EvaluateForClientAsync(cancellationToken);
}
