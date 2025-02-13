using Frontend.TestWeb.Features;
using Frontend.TestWeb.Features.ClientConfigProviders;
using Frontend.TestWeb.Features.ClientContent;
using Frontend.TestWeb.Features.ClientContent.Mappers;
using Frontend.TestWeb.Tests.Multitenancy;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.ContentEndpoint;
using Frontend.Vanilla.Features.Diagnostics.SiteVersion;
using Frontend.Vanilla.Features.EntryWeb.DataLayer.TagManagers;
using Frontend.Vanilla.RestMocks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Frontend.TestWeb;

public static class TestWebServices
{
    public static void AddTestWebServices(this IServiceCollection services)
    {
        services.AddRestMocks();

        services.AddSingleton(new DynaConParameter("context.product", PlaygroundPlugin.Product));
        services.AddSingleton(new DynaConParameter("service", "VanillaTestWeb:1"));
        services.AddSingleton<IDiagnosticsComponentProvider, TestWebDiagnosticsComponentProvider>();
        services.AddSingleton<IClientConfigProvider, TestConfigProvider1>();
        services.AddSingleton<IClientConfigProvider, TestConfigProvider2>();
        services.AddSingleton<IClientConfigProvider, PublicPageClientConfigurationProvider>();
        services.AddSingleton<IClientConfigProvider, ContentMessagesClientConfigurationProvider>();
        services.AddSingleton<ITestDslProvider, TestDslProvider>();
        services.AddDslValueProvider<ITestDslProvider>();
        services.AddSingleton<IClientConfigProvider, RequestDslProviderTestClientConfigProvider>();
        services.AddTransient<RequestDslProviderTestData>();
        services.AddTransient<Func<RequestDslProviderTestData>>(p =>
        {
            var data = p.GetRequiredService<RequestDslProviderTestData>();

            return () => data;
        });
        services.AddSingleton<ITagManager, DummyTagManagerRenderer>();
        services.AddConfiguration<IMultitenancyTestConfiguration, MultitenancyTestConfiguration>(MultitenancyTestConfiguration.FeatureName);
        services.AddSingleton<IConfigureOptions<ContentEndpointOptions>, PlaygroundContentEndpointBootstrapper>();
        services.AddSingleton(p =>
        {
            var factory = p.GetRequiredService<IClientContentServiceFactory>();
            var mappings = factory.CreateBaseMappings();
            mappings.Add(ClientContentMapping.Create(new ClientPCIFrameMapper(), true));

            return factory.CreateService<IPlaygroundClientContentService>(new ClientContentServiceOptions { Mappings = { mappings } });
        });

        services.AddControllers(options => options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true);
    }
}
