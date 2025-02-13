using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.Globalization.Diagnostics;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Globalization;

internal static class GlobalizationServices
{
    public static void AddGlobalizationFeature(this IServiceCollection services)
    {
        services.AddFacadeFor<ILanguageService>();
        services.AddSingleton<IHealthCheck, PosApiSupportedLanguagesHealthCheck>();

        services.AddSingleton<IDateTimeCultureBasedFormatter, DateTimeCultureBasedFormatter>();

        // Config
        services.AddConfigurationWithFactory<IGlobalizationConfiguration, GlobalizationConfigurationDto, GlobalizationConfigurationFactory>(GlobalizationConfiguration
            .FeatureName);
        services.AddSingleton<ILanguageFactory, LanguageFactory>();
        services.AddSingleton<ICultureSerializer, CultureSerializer>();
        services.AddSingleton<ICultureOverridesMerger, CultureOverridesMerger>();

        // Resolvers
        services.AddSingleton<IAllowedLanguagesResolver, AllowedLanguagesResolver>();
        services.AddSingleton<IBrowserLanguageResolver, BrowserLanguageResolver>();
        services.AddSingleton<IRobotLanguageResolver, RobotLanguageResolver>();
        services.AddSingleton<ICultureUrlTokenResolver, CultureUrlTokenResolver>();
        services.AddSingleton<ICurrentLanguageResolver, CurrentLanguageResolver>();
        services.AddSingleton<IHiddenLanguagesResolver, HiddenLanguagesResolver>();
        services.AddSingleton<IInternalLanguagesResolver, InternalLanguagesResolver>();
        services.AddSingleton<ILanguageByNameResolver, LanguageByNameResolver>();
        services.AddSingleton<ILanguageByUserClaimsResolver, LanguageByUserClaimsResolver>();
        services.AddSingleton<IUserPreferredLanguageResolver, UserPreferredLanguageResolver>();
        services.AddSingleton<IVisitorSettingsLanguageResolver, VisitorSettingsLanguageResolver>();
    }
}
