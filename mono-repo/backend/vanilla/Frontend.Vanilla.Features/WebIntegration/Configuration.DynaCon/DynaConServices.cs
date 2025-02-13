using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.Session;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.DependencyInjection;
using Frontend.Vanilla.Features.WebIntegration.Core;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;

internal static class DynaConServices
{
    public const string VanillaDynaConService = "VanillaFramework:6";
    public const string LabelHostDynaConService = "LabelHost:6";

    public static void AddDynaConConfigurationIntegration(this IServiceCollection services)
    {
        services.AddSingleton<ICurrentTenantResolver, CurrentLabelTenantResolver>();
        services.AddSingleton<ICurrentProductResolver, CurrentProductResolver>();
        services.AddSingleton<ITenantSettingsFactory, MultitenantSettingsFactory>();
        services.AddSingleton<IDynaConParameterReplacer, DynaConParameterReplacer>();
        services.AddSingleton<IDynaConParameterExtractor, DynaConParameterExtractor>();
        services.AddSingleton<IDynaConOverridesSessionIdentifier, WebDynaConOverridesSessionIdentifier>();

        services.AddSingleton(new DynaConParameter("service", VanillaDynaConService));
        services.AddSingleton(new DynaConParameter("service", LabelHostDynaConService));
        services.AddSingleton(p => new DynaConParameter("context.environment", p.GetRequiredService<IEnvironmentNameProvider>().EnvironmentName));

        services.AddSingleton<IDynaConConfiguration, DynaConConfiguration>();
        services.AddSingleton(p => p.Create<DynaConEngineSettingsFactory>().Create());
    }
}
