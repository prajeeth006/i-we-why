using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.RangeDatepicker;

internal static class RangeDatepickerService
{
    public static void AddRangeDatepickerFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IRangeDatepickerConfiguration, RangeDatepickerConfiguration>(RangeDatepickerConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, RangeDatepickerClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, RangeDatepickerFeatureEnablementProvider>();
    }
}
