using Microsoft.Extensions.DependencyInjection;
using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Host.Features.PartyTown;

internal static class PartyTownServices
{
    public static void AddPartyTownFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IPartyTownConfiguration, PartyTownConfiguration>(PartyTownConfiguration.FeatureName);
    }
}
