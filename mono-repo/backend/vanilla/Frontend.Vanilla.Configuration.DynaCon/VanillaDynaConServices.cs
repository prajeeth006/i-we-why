using System;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.B_Feature;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.C_Instance;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.D_InstanceJson;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.E_Context;
using Frontend.Vanilla.Configuration.DynaCon.FileFallback;
using Frontend.Vanilla.Configuration.DynaCon.Initialization;
using Frontend.Vanilla.Configuration.DynaCon.Integration;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.ManipulationService;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.Session;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Configuration.DynaCon.Polling;
using Frontend.Vanilla.Configuration.DynaCon.Polling.Changes;
using Frontend.Vanilla.Configuration.DynaCon.Polling.ContextHierarchy;
using Frontend.Vanilla.Configuration.DynaCon.Polling.ProactiveValidation;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Core;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.DependencyInjection;
using Frontend.Vanilla.Core.DependencyInjection.Decorator;
using Frontend.Vanilla.Core.DependencyInjection.ExternallyManaged;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Json.Converters;
using Frontend.Vanilla.Core.Reflection.Delegator;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.Reflection.Proxy;
using Frontend.Vanilla.Core.Time.Background;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Newtonsoft.Json.Converters;

namespace Frontend.Vanilla.Configuration.DynaCon;

/// <summary>
/// Vanilla DynaCon configuration engine.
/// </summary>
public static class VanillaDynaConServices
{
    /// <summary>
    /// Adds Vanilla DynaCon configuration engine.
    /// Also adds dependency <see cref="VanillaCoreServices.AddVanillaCore" />.
    /// </summary>
    public static IServiceCollection AddVanillaDynaConConfigurationEngine(this IServiceCollection services)
    {
        // GENERAL NOTES: decorators are preferred over conditional service creation b/c it's too complicated to test all setups
        if (!services.TryMarkAsLoaded("Vanilla.DynaCon"))
            return services;

        // Dependencies
        services.AddVanillaCore();

        // Settings
        services.TryAddSingleton(p => p.GetRequiredService<DynaConEngineSettingsBuilder>().Build()); // Try b/c website provides own factory
        services.AddExternallyManaged<TenantSettings>(ServiceLifetime.Scoped);
        services.TryAddSingleton<ITenantSettingsFactory, SingleTenantSettingsFactory>();

        // Main services
        services.AddSingleton<IConfigurationEngine, DynaConProxyConfigurationEngine>(); // Actual engine
        services.AddSingleton<ICurrentConfigurationResolver, CurrentConfigurationResolver>();
        services.AddScopedWithDecorators<IConfigurationContainer, ConfigurationContainer>(b => b
            .DecorateBy<OverridesConfigurationContainerDecorator>()
            .DecorateBy<BackupToFallbackFileDecorator>());
        services.AddScoped<IConfigurationSnapshotFactory, ConfigurationSnapshotFactory>();
        services.AddScoped<IHistoryLog<PastChangesetInfo>, HistoryLog<PastChangesetInfo>>(
            new InjectedArgument(p => p.GetRequiredService<DynaConEngineSettings>().PastChangesetsMaxCount));

        // Initialization (once)
        services.AddSingleton<IConfigurationInitializer>(p => new CompositeInitializer(new IConfigurationInitializer[]
        {
            p.Create<ContextHierarchyInitializer>(),
            p.GetRequiredService<IPollingScheduler<UpdateContextHierarchyJob>>(),
        }));
        services.AddScoped<ChangesetInitializer>();
        services.AddScopedWithDecorators<IInitialChangesetLoader, CurrentChangesetLoader>(b => b
            .DecorateBy<FallbackChangesetLoader>()
            .DecorateBy<ExplicitChangesetLoader>());

        // Multitenancy
        services.TryAddSingleton<ICurrentTenantResolver, SingleTenantResolver>();
        var getFacadeOverridesServiceType = RoslynProxy.EnqueueClassGeneration(new FacadeProxyBuilder(typeof(IConfigurationOverridesService)));
        services.AddScoped(p => new TenantServices(
            new CompositeInitializer(new IConfigurationInitializer[] // Initialization of each tenant
            {
                p.GetRequiredService<ChangesetInitializer>(),
                p.GetRequiredService<IPollingScheduler<PollForChangesJob>>(),
                p.GetRequiredService<IPollingScheduler<ProactiveValidationJob>>(),
            }),
            p.Create<CurrentChangesetResolver>(),
            p.GetRequiredService<ConfigurationReporter>(),
            (IConfigurationOverridesService)p.Create(getFacadeOverridesServiceType())));
        services.AddSingleton<ITenantManager, TenantManager>();
        services.AddSingleton<ITenantFactory, TenantFactory>();
        services.AddMultitenant(t => t.ChangesetResolver, decoratorType: typeof(CachedChangesetResolver));
        services.AddMultitenant(t => t.Reporter);
        services.AddMultitenant(t => t.OverridesService);

        // Context
        services.AddSingleton<ICurrentContextHierarchy>(p => p.GetRequiredService<ICurrentContextHierarchyManager>());
        services.AddSingleton<ICurrentContextHierarchyManager, CurrentContextHierarchy>();
        services.AddSingleton<IContextHierarchyRestService, ContextHierarchyRestService>();
        services.AddScoped(p => p.Create<StaticVariationContextFactory>().Create());
        services.AddSingleton<IDynamicVariationContextResolver, DynamicVariationContextResolver>();

        // REST service
        services.AddScoped<IConfigurationRestService, ConfigurationRestService>();
        services.AddSingletonWithDecorators<IConfigurationRestClient, ConfigurationRestClient>(b => b
            .DecorateBy<ConfigurationRestClientLogger>());
        services.AddScoped<IConfigurationServiceUrls, ConfigurationServiceUrls>();
        services.AddSingleton<IHistoryLog<RestServiceCallInfo>, HistoryLog<RestServiceCallInfo>>(
            new InjectedArgument(p => p.GetRequiredService<DynaConEngineSettings>().PastServiceCallsMaxCount));

        // Deserialization - Context
        services.AddSingletonWithDecorators<IContextEnumerator, DefaultContextEnumerator>(b => b
            .DecorateBy<ContextCombinationDecorator>());
        services.AddSingleton<IContextHierarchyExpander, ContextHierarchyExpander>();

        // Deserialization - InstanceJson
        services.AddScopedWithDecorators<IInstanceJsonResolver, DefaultInstanceJsonResolver>(b => b
            .DecorateBy<PlaceholderReplacingDecorator>()
            .DecorateBy<InstanceJsonOptimizationDecorator>());
        services.AddSingleton<IInstanceJsonBuilder, InstanceJsonBuilder>();

        // Deserialization - Instance
        services.AddScopedWithDecorators<IInstanceDeserializer, DefaultInstanceDeserializer>(b => b
            .DecorateBy<ResultValidationDecorator>());
        services.AddSingleton(new ConfigurationInstanceJsonConverter(new StringEnumConverter()));
        services.AddSingleton(new ConfigurationInstanceJsonConverter(new RegexStringJsonConverter()));

        // Deserialization - Feature
        services.AddScopedWithDecorators<IFeatureDeserializer, DefaultFeatureDeserializer>(b => b
            .DecorateBy<PropertyMismatchDecorator>()
            .DecorateBy<ValuesOptimizationDecorator>() // Optimize after it's cleaned by following decorator
            .DecorateBy<InputCleanUpDecorator>()
            .DecorateBy<InstanceCountOverflowDecorator>());

        // Deserialization - Changeset
        services.AddScopedWithDecorators<IChangesetDeserializer, DefaultChangesetDeserializer>(b => b // Scoped b/c feedback is tenant-specific
            .DecorateBy<TimeBasedDeserializerDecorator>()
            .DecorateBy<FeedbackDeserializerDecorator>());

        // Polling - Changes
        services.AddScoped<IPollingScheduler<PollForChangesJob>, PollingScheduler<PollForChangesJob>>();
        services.AddScoped<PollForChangesJob>();
        services.AddScoped<IChangesProcessor, ChangesProcessor>();
        services.AddScoped<IActivateChangesetScheduler, ActivateChangesetScheduler>(
            new InjectedArgument(p => new Func<IValidChangeset, IActivateChangesetJob>(c => p.Create<ActivateChangesetJob>(c))));

        // Polling - Proactive Validation
        services.AddScoped<IPollingScheduler<ProactiveValidationJob>, PollingScheduler<ProactiveValidationJob>>();
        services.AddScoped<ProactiveValidationJob>();
        services.AddScoped<IHistoryLog<ValidatedChangesetInfo>, HistoryLog<ValidatedChangesetInfo>>(
            new InjectedArgument(p => p.GetRequiredService<DynaConEngineSettings>().PastProactivelyValidatedChangesetsMaxCount));

        // Polling - Context Hierarchy
        services.AddSingleton<IPollingScheduler<UpdateContextHierarchyJob>, PollingScheduler<UpdateContextHierarchyJob>>();
        services.AddSingleton<UpdateContextHierarchyJob>();

        // Fallback
        services.AddScoped<IFallbackFile<IValidChangeset>, FallbackFile<IValidChangeset>>();
        services.AddScoped<IFallbackFileDataHandler<IValidChangeset>, ChangesetFallbackFileHandler>();
        services.AddSingleton<IFallbackFile<VariationContextHierarchy>, FallbackFile<VariationContextHierarchy>>();
        services.AddSingleton<IFallbackFileDataHandler<VariationContextHierarchy>, ContextHierarchyFallbackFileHandler>();
        services.AddSingleton(GetAppIdentifier.Handler);

        // Local Overrides - Common
        services.AddScoped<IClearOverridesCommand, ClearOverridesCommand>();
        services.AddScoped<ISetAllOverridesJsonCommand, SetAllOverridesJsonCommand>();
        services.AddScoped(p => p.Create<OverridesStorageFactory>().Create());
        services.AddScopedWithDecorators<IChangesetOverrider, ChangesetOverrider>(b => b
            .DecorateBy<OverridesValidationOverrider>());
        services.AddSingleton<IOverridesJsonMerger, OverridesJsonMerger>();
        services.TryAddSingleton<IDynaConOverridesSessionIdentifier, StaticDynaConOverridesSessionIdentifier>();

        // Reporting
        services.AddSingleton<IHealthCheck, DynaConHealthCheck>();
        services.AddScoped<ConfigurationReporter>();
        services.AddScoped<IPartialConfigurationReporter, ChangesetReporter>();
        services.AddScoped<IPartialConfigurationReporter, FallbackFileReporter<IValidChangeset>>(
            new InjectedArgument(new ChangesetFallbackReportHandler()));
        services.AddScoped<IPartialConfigurationReporter, FallbackFileReporter<VariationContextHierarchy>>(
            new InjectedArgument(p => p.Create<ContextHierarchyFallbackReportHandler>()));
        services.AddScoped<IPartialConfigurationReporter, LocalOverridesReporter>();
        services.AddScoped<IPartialConfigurationReporter, PollingForChangesReporter>();
        services.AddScoped<IPartialConfigurationReporter, ProactiveValidationReporter>();
        services.AddScoped<IPartialConfigurationReporter, SettingsReporter>();
        services.AddScoped<IPartialConfigurationReporter, VariationContextReporter>();
        services.AddSingleton<IPartialConfigurationReporter, ServiceCallsReporter>();
        services.AddSingleton<IPartialConfigurationReporter, MultitenancyReporter>();

        // Integration
        services.AddSingleton<IBackgroundWorkInitializer, AppContextBackgroundWorkInitializer>();

        return services;
    }

    private static void AddMultitenant<TService>(this IServiceCollection services, Func<ITenant, TService> selectMultitenantService, Type? decoratorType = null)
        where TService : class
    {
        var getProxyType = RoslynProxy.EnqueueClassGeneration(new DelegatorProxyBuilder(typeof(TService)));
        services.AddSingleton(typeof(TService), provider =>
        {
            var tenantManager = provider.GetRequiredService<ITenantManager>();
            var service = Activator.CreateInstance(getProxyType(), new LambdaProxyDelegator(_ =>
            {
                var tenant = tenantManager.GetCurrentTenant();

                return selectMultitenantService(tenant);
            }))!;

            return decoratorType != null ? provider.Create(decoratorType, service) : service;
        });
    }
}
