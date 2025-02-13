using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.ValueTicket;

internal static class ValueTicketServices
{
    public static void AddValueTicketFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, ValueTicketClientConfigProvider>();
    }
}
