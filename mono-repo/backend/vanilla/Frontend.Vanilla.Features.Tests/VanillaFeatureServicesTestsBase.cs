using System;
using System.Collections.Generic;
using System.Reflection;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.CssOverrides;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.ServerUtils;
using Frontend.Vanilla.Features.Diagnostics.SiteVersion;
using Frontend.Vanilla.Features.Ioc;
using Frontend.Vanilla.Features.Visitor;
using Frontend.Vanilla.Features.WebIntegration;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.Features.WebIntegration.Core;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing.AbstractTests;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Moq;

namespace Frontend.Vanilla.Features.Tests;

public abstract class VanillaFeatureServicesTestsBase : DependencyInjectionTestsBase
{
    internal override void SetupTestedServices(IServiceCollection services)
        => services.AddVanillaFeatures();

    internal override void SetupFakes(IServiceCollection services)
    {
        var parameters = new Dictionary<string, string> { ["context.product"] = "Test:1" };

        services
            .AddSingleton(Mock.Of<IHostEnvironment>())
            .AddSingleton(new DynaConEngineSettingsBuilder(new DynaConParameter("service", "Test:1"), new DynaConParameter("context.product", "Test:1")))
            .AddSingleton(new ReferencedAssemblies(Array.Empty<Assembly>()))
            .AddSingleton(Mock.Of<ICookieHandler>())
            .AddSingleton(Mock.Of<ILastVisitorCookie>())
            .AddSingleton(Mock.Of<ICssOverridesProvider>())
            .AddSingleton(Mock.Of<IDiagnosticsComponentProvider>())
            .AddSingleton(Mock.Of<IHttpContextAccessor>())
            .AddSingleton(Mock.Of<IEnvironmentNameProvider>(e => e.EnvironmentName == "dev"))
            .AddSingleton(Mock.Of<ISingleDomainAppConfiguration>())
            .AddSingleton(Mock.Of<IWebAuthenticationService>())
            .AddSingleton(Mock.Of<ITraceRecorder>())
            .AddSingleton(Mock.Of<IAuthenticationDslProvider>())
            .AddSingleton(Mock.Of<ISitecoreLinkUrlProvider>())
            .AddSingleton(Mock.Of<IEndpointMetadata>())
            .AddSingleton(Mock.Of<IConfiguration>(c => c.GetSection("ConnectionStrings")["Hekaton"] == "testConnectionString"))
            .AddSingleton(Mock.Of<IDynaConConfiguration>(c => c.Parameters == parameters))
            .AddSingleton(Mock.Of<IHttpContextAccessor>())
            .AddSingleton(Mock.Of<IServerIPProvider>());
    }
}
