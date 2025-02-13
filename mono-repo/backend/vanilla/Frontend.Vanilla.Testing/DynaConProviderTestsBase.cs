using FluentAssertions;
using Frontend.Vanilla.Features.DynaConVariationContext;
using Xunit;

namespace Frontend.Vanilla.Testing;

/// <summary>
/// Base class used to ease dynacon provider tests.
/// </summary>
public abstract class DynaConProviderTestsBase
{
    internal IWebDynaConVariationContextProvider Target { get; set; }

    /// <summary>Used to test name as singleton.</summary>
    [Fact]
    public void Name_ShouldBeSpecified()
        => Target.Name.Should().NotBeNull()
            .And.BeSameAs(Target.Name, "should be singleton");

    /// <summary>Used to test default value.</summary>
    [Fact]
    public void DefaultValue_ShouldBeSpecified()
        => Target.DefaultValue.Should().NotBeNull()
            .And.BeSameAs(Target.DefaultValue, "should be singleton");
}
