using System;
using FluentAssertions;
using Frontend.Vanilla.Core.DependencyInjection.ExternallyManaged;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.DependencyInjection.ExternallyManaged;

public class ExternallyManagedExtensionsTests
{
    [Fact]
    public void ShouldManageServiceExternally()
    {
        var services = new ServiceCollection();
        services.AddExternallyManaged<string>(ServiceLifetime.Singleton);

        var provider = services.BuildServiceProvider();
        var manager = provider.GetService<ExternalManager<string>>();

        provider.Invoking(p => p.GetService<string>()).Should().Throw<InvalidOperationException>();
        provider.GetService<ExternalManager<string>>().Should().BeSameAs(manager, "should be singleton");

        manager.Value = "Batman";
        provider.GetService<string>().Should().Be("Batman");

        manager.Value = "Joker";
        provider.GetService<string>().Should().Be("Joker");
    }

    [Fact]
    public void ShouldManageScoped()
    {
        var services = new ServiceCollection();
        services.AddExternallyManaged<string>(ServiceLifetime.Scoped);

        var provider = services.BuildServiceProvider();
        var scope1 = provider.CreateScope().ServiceProvider;
        var scope2 = provider.CreateScope().ServiceProvider;

        var manager1 = scope1.GetService<ExternalManager<string>>();
        var manager2 = scope2.GetService<ExternalManager<string>>();

        manager1.Should().NotBeSameAs(manager2);
        scope1.GetService<ExternalManager<string>>().Should().BeSameAs(manager1);
        scope2.GetService<ExternalManager<string>>().Should().BeSameAs(manager2);

        scope1.Invoking(p => p.GetService<string>()).Should().Throw<InvalidOperationException>();
        scope2.Invoking(p => p.GetService<string>()).Should().Throw<InvalidOperationException>();

        manager1.Value = "Batman";
        scope1.GetService<string>().Should().Be("Batman");
        scope2.Invoking(p => p.GetService<string>()).Should().Throw<InvalidOperationException>();

        manager2.Value = "Joker";
        scope1.GetService<string>().Should().Be("Batman");
        scope2.GetService<string>().Should().Be("Joker");
    }
}
