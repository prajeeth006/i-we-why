using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.SharedFeatures.Api.Features.TerminalSession;

internal static class TerminalSessionServices
{
    public static void AddTerminalSessionFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ITerminalSessionConfiguration, TerminalSessionConfiguration>(TerminalSessionConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, TerminalSessionClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, TerminalSessionFeatureEnablementProvider>();
    }
}
