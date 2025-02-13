using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.LabelSwitcher;

internal static class LabelSwitcherServices
{
    public static void AddLabelSwitcherFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ILabelSwitcherConfiguration, LabelSwitcherConfiguration>(LabelSwitcherConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, LabelSwitcherClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, LabelSwitcherFeatureEnablementProvider>();
    }
}
