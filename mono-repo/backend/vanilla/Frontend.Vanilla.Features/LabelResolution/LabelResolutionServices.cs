using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.LabelResolution;

internal static class LabelResolutionServices
{
    public static void AddLabelResolutionFeature(this IServiceCollection services)
    {
        services.AddSingleton<ILabelResolver, LabelResolver>();
    }
}
