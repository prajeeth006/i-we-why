using System;
using System.ComponentModel;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers;

public class DependencyInjectionExtensionsTests
{
    private readonly ServiceCollection services;

    public DependencyInjectionExtensionsTests()
        => services = new ServiceCollection();

    [Description("Blah")]
    public interface IFooBarDslProvider { }

    [Fact]
    public void ShouldRegisterDslValuesProvider()
    {
        var providerInstance = Mock.Of<IFooBarDslProvider>();
        services.AddSingleton(providerInstance);

        // Act
        services.AddDslValueProvider<IFooBarDslProvider>();

        var dslProvider = services.BuildServiceProvider().GetRequiredService<DslValueProvider>();
        dslProvider.Name.Should().Be("FooBar");
        dslProvider.ExposedType.Should().Be(typeof(IFooBarDslProvider));
        dslProvider.Instance.Should().BeSameAs(providerInstance);
    }

    [Fact]
    public void ShouldFailResolution_IfMissingInstanceRegistration()
    {
        services.AddDslValueProvider<IFooBarDslProvider>();
        var provider = services.BuildServiceProvider();

        Func<object> act = provider.GetRequiredService<DslValueProvider>;

        act.Should().Throw<InvalidOperationException>()
            .Which.Message.Should().Contain(typeof(IFooBarDslProvider).ToString());
    }
}
