using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.PublicPages;

internal static class PublicPagesServices
{
    public static void AddPublicPagesFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IPublicPagesConfiguration, PublicPagesConfiguration>(PublicPagesConfiguration.FeatureName);
        services.AddSingleton<IRequestedContentValidator, RequestedContentValidator>();
    }
}
