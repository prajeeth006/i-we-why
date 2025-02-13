using Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Visitor;

internal static class VisitorServices
{
    public static void AddVisitorFeature(this IServiceCollection services)
    {
        services.AddSingleton<IVisitorSettingsManager, VisitorSettingsManager>();
        services.AddSingleton<ILastVisitorCookie, LastVisitorCookie>();
        services.AddSingleton<ILoginFilter, LastVisitorLoginFilter>();
    }
}
