using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.EdsGroup;

internal static class EdsGroupServices
{
    public static void AddEdsGroupFeature(this IServiceCollection services)
    {
        services.AddSingleton<IEdsGroupService, EdsGroupService>();
    }
}
