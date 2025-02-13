using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Frontend.Vanilla.Features.Login.Integration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Login;

internal static class LoginServices
{
    public static void AddLoginFeatureBase(this IServiceCollection services)
    {
        services.AddSingleton<ISuperCookie, SuperCookie>();
    }

    public static void AddLoginFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ILoginSettingsConfiguration, LoginSettingsConfiguration>(LoginSettingsConfiguration.FeatureName); // TODO: Remove
        services.AddConfiguration<ILoginConfiguration, LoginConfiguration>(LoginConfiguration.FeatureName);
        services.AddSingleton<IRememberMeTokenStorage, RememberMeTokenStorage>();
        services.AddSingleton<ILoginService, LoginService>();
        services.AddSingleton<IDeviceFingerprintEnricher, DeviceFingerprintEnricher>();
        services.AddSingleton<IMobilePhoneLoginService, MobilePhoneLoginService>();

        // add
        services.AddSingleton<IClientConfigProvider, Login2ClientConfigProvider>(); // TODO: Remove
        services.AddSingleton<IClientConfigProvider, LoginContentClientConfigProvider>(); // TODO: Remove
        services.AddSingleton<IClientConfigProvider, LoginClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, LoginFeatureEnablementProvider>();

        // login integration
        services.AddConfiguration<ILoginIntegrationConfiguration, LoginIntegrationConfiguration>(LoginIntegrationConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, LoginIntegrationClientConfigProvider>();

        services.AddSingleton<AutoLoginWithSsoTokenHandler>();
        services.AddSingleton<AutoLoginWithUsernameAndPasswordHandler>();
        services.AddSingleton<AutoLoginWithTempTokenHandler>();

        services.AddSingleton<ILoginResultHandler, LoginResultHandler>();
        services.AddSingleton<ILoginResultHandlerInternal, LoginResultHandler>();
    }
}
