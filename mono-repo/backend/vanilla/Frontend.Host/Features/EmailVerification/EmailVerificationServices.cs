using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.EmailVerification;

internal static class EmailVerificationServices
{
    public static void AddEmailVerificationFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IEmailVerificationConfiguration, EmailVerificationConfiguration>(EmailVerificationConfiguration.FeatureName);
    }
}
