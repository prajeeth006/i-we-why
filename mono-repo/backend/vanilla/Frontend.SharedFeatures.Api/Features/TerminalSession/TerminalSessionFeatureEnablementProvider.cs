using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.SharedFeatures.Api.Features.TerminalSession;

internal sealed class TerminalSessionFeatureEnablementProvider(ITerminalSessionConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.TerminalSession;
    public string Source => $"{TerminalSessionConfiguration.FeatureName}.{nameof(config.IsEnabledCondition)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        config.IsEnabledCondition.EvaluateForClientAsync(cancellationToken);
}
