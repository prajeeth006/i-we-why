using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.LicenseInfo;

internal static class LicenseInfoServices
{
    public static void AddLicenseInfoFeature(this IServiceCollection services)
    {
        services.AddSingleton<ILicenseInfoService, LicenseInfoService>();
        services.AddSingleton<ILicenseInfoServiceInternal, LicenseInfoServiceInternal>();
        services.AddConfiguration<ILicenseInfoConfiguration, LicenseInfoConfiguration>(LicenseInfoConfiguration.FeatureName);
    }
}
