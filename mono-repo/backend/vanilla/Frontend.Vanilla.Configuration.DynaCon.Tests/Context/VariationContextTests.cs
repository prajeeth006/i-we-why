using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.Fakes;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Context;

public sealed class VariationContextTests
{
    [Theory]
    [InlineData(0UL)]
    [InlineData(1UL)]
    [InlineData(666UL)]
    public void Constructor_ShouldCreateCorrectly(ulong priority)
    {
        var props = new (TrimmedRequiredString, TrimmedRequiredString)[]
        {
            ("label", "bwin.com"),
            ("environment", "QA66"),
            ("EnvironMENT", "qa88"),
            ("environment", "qa"),
        };

        // Act
        var target = new VariationContext(priority, props);

        target.Priority.Should().Be(priority);
        target.Properties.Select(p => p.Key).Should().BeEquivalentTo(new[] { "environment", "label" }.AsTrimmed());
        target.Properties["label"].Should().BeEquivalentTo(new[] { "bwin.com" }.AsTrimmed());
        target.Properties["environment"].Should().BeEquivalentTo(new[] { "qa", "QA66", "qa88" }.AsTrimmed());
    }

    [Fact]
    public void ToString_ShouldReturnAllProperties()
    {
        var target = new VariationContext(
            666,
            new (TrimmedRequiredString, TrimmedRequiredString)[]
            {
                ("label", "bwin.com"),
                ("environment", "qa88"),
                ("environment", "qa66"),
            });

        // Act
        target.ToString().Should().Be("(environment=[qa66, qa88], label=[bwin.com], priority=666)");
    }

    [Fact]
    public void ToString_ShoulReturnAny_IfNoProperties()
    {
        var target = new VariationContext(666, Array.Empty<(TrimmedRequiredString, TrimmedRequiredString)>());
        target.ToString().Should().Be("(any, priority=666)"); // Act
    }
}
