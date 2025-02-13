using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Games;

internal static class GamesServices
{
    public static void AddGamesFeature(this IServiceCollection services)
    {
        services.AddSingleton<IGamesMetadataService, GamesMetadataService>();
        services.AddConfiguration<IGameMetadataConfiguration, GameMetadataConfiguration>(GameMetadataConfiguration.FeatureName);
    }
}
