using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.Testing.AbstractTests;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests;

public sealed class VanillaDslServicesTests
{
    [Fact]
    public void ShouldAllowAddingServicesOnlyOnce()
        => AddServicesOnceTest.Run<IDslCompiler>(s => s.AddVanillaDomainSpecificLanguage().AddFakeVanillaDslProviders());

    [Theory]
    [InlineData(typeof(IDslCompiler))]
    [InlineData(typeof(IDslSyntaxValidator))]
    [InlineData(typeof(IPlaceholderCompiler))]
    [InlineData(typeof(ConfigurationInstanceJsonConverter))]
    public void ShouldExposePublicServices(Type serviceType)
    {
        var services = BuildServices();

        var target = services.GetRequiredService(serviceType); // Act

        services.GetService(serviceType).Should().BeSameAs(target, "should be singleton");
    }

    [Fact]
    public void ShouldThrow_IfNoProviderImplementations()
    {
        var services = BuildServices(addFakeProviders: false);

        Action act = () => services.GetService<IDslCompiler>();

        act.Should().Throw<InvalidOperationException>()
            .Which.Message.Should().MatchRegex(@"No service for type 'Frontend\.Vanilla\.DomainSpecificLanguage\.Providers\.Contracts\.\w+' has been registered\.");
    }

    private static IServiceProvider BuildServices(bool addFakeProviders = true)
        => new ServiceCollection()
            .AddVanillaDomainSpecificLanguage()
            .If(addFakeProviders, s => FakeDslProviders.AddFakeVanillaDslProviders(s))
            .BuildServiceProvider();
}
