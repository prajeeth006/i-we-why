using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.DependencyInjection.ExternallyManaged;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Testing.AbstractTests;
using Frontend.Vanilla.Testing.FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests;

public sealed class VanillaDynaConServicesTests
{
    private readonly IServiceProvider services = new ServiceCollection()
        .AddVanillaDynaConConfigurationEngine()
        .AddSingleton(TestSettings.GetBuilder())
        .AddConfiguration<IFooConfiguration, FooConfiguration>("Foo")
        .BuildServiceProvider(validateScopes: true);

    public interface IFooConfiguration { }

    public class FooConfiguration : IFooConfiguration { }

    [Fact]
    public void ShouldAllowAddingServicesOnlyOnce()
        => AddServicesOnceTest.Run<IConfigurationInitializer>(s => s.AddVanillaDynaConConfigurationEngine().AddSingleton(TestSettings.Get()));

    [Theory]
    [InlineData(typeof(IConfigurationInitializer))]
    [InlineData(typeof(IFooConfiguration))]
    [InlineData(typeof(IConfigurationEngine))]
    [InlineData(typeof(IConfigurationReporter))]
    // [InlineData(typeof(IConfigurationOverridesService))] TODO
    public void ShouldResolve(Type type)
    {
        var obj = services.GetRequiredService(type);
        services.GetService(type).Should().BeSameAs(obj, "Should be singleton");
    }

    [Fact]
    public void ShouldResolveTenantServicesWithinScope()
        => CreateScope().GetRequiredService<TenantServices>();

    [Fact]
    public void ShouldResolveHealthCheckOfParticularType()
        => services.GetService<IHealthCheck>().Should().BeOfType<DynaConHealthCheck>();

    [Fact]
    public void ShouldResolveAllPartialReporters()
    {
        var expectedTypes = typeof(IPartialConfigurationReporter).Assembly.GetTypes()
            .Where(t => t.IsFinalClass() && typeof(IPartialConfigurationReporter).IsAssignableFrom(t))
            .Append(typeof(FallbackFileReporter<IValidChangeset>), typeof(FallbackFileReporter<VariationContextHierarchy>));

        var reporters = CreateScope().GetServices<IPartialConfigurationReporter>();
        reporters.Select(r => r.GetType()).Should().BeEquivalentTo(expectedTypes);
    }

    [Fact]
    public void ShouldNotRegisterAnyDynaConParameter_ToBeUsableWithAnyAppNotJustVanilla()
        => services.GetServices<DynaConParameter>().Should().BeEmpty();

    [Fact]
    public void DynaConParameter_ShouldIncludeBuilderInErrorMessage()
        => new Func<object>(() => new DynaConParameter("changesetId", "123"))
            .Should().Throw().Which.Message.Should()
            .Contain($"Use {nameof(DynaConEngineSettingsBuilder)}.{nameof(DynaConEngineSettingsBuilder.ExplicitChangesetId)} instead.");

    private IServiceProvider CreateScope()
    {
        var scope = services.CreateScope().ServiceProvider;
        scope.GetRequiredService<ExternalManager<TenantSettings>>().Value = TestSettings.GetTenant();

        return scope;
    }
}
