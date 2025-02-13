using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.DropdownHeader;

internal sealed class DropdownHeaderFeatureEnablementProvider(IDropdownHeaderConfiguration config) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.DropdownHeader;
    public string Source => $"{DropdownHeaderConfiguration.FeatureName}.{nameof(config.IsEnabled)}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(config.IsEnabled));
}
