using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Tooltips;

internal static class TooltipsServices
{
    public static void AddTooltipFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ITooltipsConfiguration, TooltipsConfiguration>(TooltipsConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, TooltipsClientConfigProvider>();
    }
}
