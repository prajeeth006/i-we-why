using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.ValueSegment;

internal static class ValueSegmentServices
{
    public static void AddValueSegmentFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, ValueSegmentClientConfigProvider>();
    }
}
