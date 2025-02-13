using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.DependencyInjection.ExternallyManaged;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Multitenancy;

public class TenantFactoryTests
{
    private readonly ITenantFactory target;
    private readonly Mock<ITenantSettingsFactory> settingsFactory;
    private readonly Mock<IServiceScopeFactory> scopeFactory;
    private readonly TestClock clock;

    private readonly Mock<IServiceScope> scope;
    private readonly Mock<IServiceProvider> serviceProvider;
    private readonly TenantSettings settings;
    private readonly ExternalManager<TenantSettings> settingsManager;
    private readonly Mock<IConfigurationInitializer> initializer;
    private readonly TenantServices tenantServices;
    private TenantSettings injectedSettings;

    public TenantFactoryTests()
    {
        settingsFactory = new Mock<ITenantSettingsFactory>();
        scopeFactory = new Mock<IServiceScopeFactory>();
        clock = new TestClock();
        target = new TenantFactory(settingsFactory.Object, scopeFactory.Object, clock);

        scope = new Mock<IServiceScope>();
        serviceProvider = new Mock<IServiceProvider>();
        settings = TestSettings.GetTenant();
        settingsManager = new ExternalManager<TenantSettings>();
        initializer = new Mock<IConfigurationInitializer>();
        tenantServices = new TenantServices(
            initializer.Object,
            Mock.Of<ICurrentChangesetResolver>(),
            Mock.Of<IConfigurationReporter>(),
            Mock.Of<IConfigurationOverridesService>());
        injectedSettings = null;

        scopeFactory.Setup(f => f.CreateScope()).Returns(scope.Object);
        scope.SetupGet(s => s.ServiceProvider).Returns(serviceProvider.Object);
        settingsFactory.Setup(f => f.Create("bwin.com")).Returns(settings);
        serviceProvider.Setup(p => p.GetService(typeof(ExternalManager<TenantSettings>))).Returns(settingsManager);
        serviceProvider.Setup(p => p.GetService(typeof(TenantServices)))
            .Callback(() => injectedSettings = settingsManager.Value)
            .Returns(tenantServices);
    }

    [Fact]
    public void ShouldCreateTenant()
    {
        // Act
        var tenant = target.Create("bwin.com");

        tenant.ChangesetResolver.Should().BeSameAs(tenantServices.ChangesetResolver);
        tenant.Reporter.Should().BeSameAs(tenantServices.Reporter);
        tenant.OverridesService.Should().BeSameAs(tenantServices.OverridesService);
        tenant.StartTime.Should().Be(clock.UtcNow);
        tenant.LastAccessTime.Should().Be(default);

        initializer.Verify(i => i.Initialize());
        injectedSettings.Should().BeSameAs(settings);
    }

    public enum FailedTestCase
    {
        /// <summary>
        /// ScopeCreation
        /// </summary>
        ScopeCreation,

        /// <summary>
        /// SettingsCreation
        /// </summary>
        SettingsCreation,

        /// <summary>
        /// ServicesResolution
        /// </summary>
        ServicesResolution,

        /// <summary>
        /// ConfigInitialization
        /// </summary>
        ConfigInitialization,
    }

    [Theory, EnumData(typeof(FailedTestCase))]
    public void ShouldWrapException(FailedTestCase testCase)
    {
        var ex = new Exception("Oups");

        switch (testCase)
        {
            case FailedTestCase.ScopeCreation:
                scopeFactory.Setup(f => f.CreateScope()).Throws(ex);

                break;
            case FailedTestCase.SettingsCreation:
                settingsFactory.SetupWithAnyArgs(f => f.Create(null)).Throws(ex);

                break;
            case FailedTestCase.ServicesResolution:
                serviceProvider.Setup(p => p.GetService(typeof(TenantServices))).Throws(ex);

                break;
            case FailedTestCase.ConfigInitialization:
                initializer.Setup(i => i.Initialize()).Throws(ex);

                break;
        }

        Action act = () => target.Create("bwin.com");

        act.Should().Throw()
            .WithMessage("Failed initializing tenant 'bwin.com'.")
            .Which.InnerException.Should().BeSameAs(ex);
    }
}
