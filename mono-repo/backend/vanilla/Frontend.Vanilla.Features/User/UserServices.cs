using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.User;

internal static class UserServices
{
    public static void AddUserFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, UserClientConfigProvider>();
    }
}
