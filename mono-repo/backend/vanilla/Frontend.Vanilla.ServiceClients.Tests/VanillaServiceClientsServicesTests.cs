using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Features.DeviceAtlas;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.Caching;
using Frontend.Vanilla.ServiceClients.Infrastructure.Diagnostics;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Filters;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Frontend.Vanilla.ServiceClients.Services.Content;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyPoint;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation;
using Frontend.Vanilla.ServiceClients.Services.Mail;
using Frontend.Vanilla.ServiceClients.Services.Notification;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.AbstractTests;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests;

public sealed class VanillaServiceClientsServicesTests : DependencyInjectionTestsBase
{
    internal override void SetupTestedServices(IServiceCollection services)
        => services.AddVanillaServiceClients();

    internal override void SetupFakes(IServiceCollection services)
        => services
            .AddSingleton(new ServiceClientsConfigurationBuilder { AccessId = "access-id" })
            .AddSingleton(new MailConfigurationBuilder { EndpointAddress = new Uri("http://spammer") })
            .AddSingleton(new LoyaltyConfiguration())
            .AddSingleton(new Mock<IConfiguration>().WithConnectionStrings().Object)
            .AddSingleton(new BettingServiceClientsConfiguration())
            .AddSingleton(new ExtendedServiceClientsConfiguration());

    public static object TestCases => new DependencyInjectionTestCases
    {
        Services = new[]
        {
            // Infrastructure
            typeof(IPosApiRestClient),
            typeof(IPosApiDataCache),
            typeof(ICurrentUserAccessor),
            typeof(IServiceClientsBaseConfiguration),

            // PosAPI Services
            typeof(IPosApiAccountService),
            typeof(IClaimsService), // Legacy
            typeof(IPosApiCommonService),
            typeof(IPosApiCrmService),
            typeof(IPosApiNotificationService),
            typeof(IPosApiWalletService),
            typeof(IPosApiContentService),
            typeof(IPosApiGeoLocationService),
        },
        MultiServices = new[]
        {
            (typeof(ICurrentContextSwitchHandler), typeof(UserDataContainerManager)),
            (typeof(IHealthCheck), typeof(PosApiHealthCheck)),
            (typeof(ILoginFilter), typeof(CacheBalanceLoginFilter)),
            (typeof(ILoginFilter), typeof(CacheLoyalyProfileLoginFilter)),
        },
        NotRegisteredServices = new[]
        {
            typeof(ServiceClientsConfigurationBuilder),
            typeof(MailConfigurationBuilder),
            typeof(LoyaltyConfiguration),
            typeof(BettingServiceClientsConfiguration),
        },
    }.GetTestCases();

    [Fact]
    public void ShouldResolverDiagnosticProviders()
        => Provider.GetServices<IDiagnosticInfoProvider>().OfType<PosApiCachedDataDiagnosticProvider>()
            .Should().HaveCount(2)
            .And.ContainSingle(p => p.Metadata.Name.Value.Contains(PosApiDataType.Static.ToString()))
            .And.ContainSingle(p => p.Metadata.Name.Value.Contains(PosApiDataType.User.ToString()));
}
