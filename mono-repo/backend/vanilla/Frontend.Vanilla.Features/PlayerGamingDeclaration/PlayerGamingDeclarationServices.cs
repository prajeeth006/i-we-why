using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.PlayerGamingDeclaration;

internal static class PlayerGamingDeclarationServices
{
    public static void AddPlayerGamingDeclarationFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, PlayerGamingDeclarationClientConfigProvider>();
        services.AddConfiguration<IPlayerGamingDeclarationConfiguration, PlayerGamingDeclarationConfiguration>(PlayerGamingDeclarationConfiguration.FeatureName);
        services.AddSingleton<IFeatureEnablementProvider, PlayerGamingDeclarationFeatureEnablementProvider>();
    }
}
