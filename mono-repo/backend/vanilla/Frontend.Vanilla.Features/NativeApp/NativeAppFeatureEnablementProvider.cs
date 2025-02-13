using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.Vanilla.Features.NativeApp;

internal sealed class NativeAppFeatureEnablementProvider(INativeAppService nativeAppService) : IFeatureEnablementProvider
{
    public string Id => FeatureIds.NativeApp;
    public string Source => $"Cookie {NativeAppConstants.CookieName}";

    public Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken) =>
        Task.FromResult(ClientEvaluationResult<bool>.FromValue(nativeAppService.GetCurrentDetails().IsNative));
}
