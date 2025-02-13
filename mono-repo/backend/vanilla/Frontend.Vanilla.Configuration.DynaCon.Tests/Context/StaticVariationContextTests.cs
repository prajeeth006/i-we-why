using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Core.System.Text;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Context;

public sealed class StaticVariationContextTests
{
    [Fact]
    public void ShouldCreateCorrectly()
    {
        var target = new StaticVariationContext(("PRODuct", "porTAL"));

        target.Should().BeEquivalentTo(new Dictionary<TrimmedRequiredString, TrimmedRequiredString> { { "product", "portal" } });
    }

    [Fact]
    public void ShouldBeCreateInsensitive()
    {
        var target = new StaticVariationContext(("product", "portal"));
        target.Should().ContainKey("PRODuct").WhoseValue.Should().Be("portal");
    }

    [Theory]
    [InlineData("context.invalid", "ok")]
    public void ShouldThrow_IfInvalidProperty(string name, string value)
    {
        var prop = (new TrimmedRequiredString(name), new TrimmedRequiredString(value));
        new Func<object>(() => new StaticVariationContext(prop)).Should().Throw<ArgumentException>();
    }

    [Fact]
    public void ShouldThrow_IfInvalidProperties()
        => new Func<object>(() => new StaticVariationContext(null)).Should().Throw<ArgumentNullException>();
}
