using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.SignUpBonusRedirect;

internal static class SignUpBonusRedirectServices
{
    public static void AddSignUpBonusRedirectFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ISignUpBonusRedirectConfiguration, SignUpBonusRedirectConfiguration>(SignUpBonusRedirectConfiguration.FeatureName);
    }
}
