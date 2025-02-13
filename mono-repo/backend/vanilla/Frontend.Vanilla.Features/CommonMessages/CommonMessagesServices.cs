using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.CommonMessages;

internal static class CommonMessagesServices
{
    public static void AddCommonMessagesFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, CommonMessagesClientConfigProvider>();
    }
}
