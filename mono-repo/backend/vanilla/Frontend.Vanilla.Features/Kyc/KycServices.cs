using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Kyc;

internal static class KycServices
{
    public static void AddKycFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IKycConfiguration, KycConfiguration>(KycConfiguration.FeatureName);
    }
}
