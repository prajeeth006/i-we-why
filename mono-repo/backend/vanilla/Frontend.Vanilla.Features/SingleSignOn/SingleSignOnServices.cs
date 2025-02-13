using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.SingleSignOn;

internal static class SingleSignOnServices
{
    public static void AddSingleSignOnFeature(this IServiceCollection services)
    {
        services.AddSingleton<IFeatureEnablementProvider, SingleSignOnFeatureEnablementProvider>();
    }
}
