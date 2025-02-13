using System;
using FluentAssertions;
using Frontend.Vanilla.Core.DependencyInjection.ExternallyManaged;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.DependencyInjection.ExternallyManaged;

public class ExternalManagerTests
{
    [Fact]
    public void ShouldSetAndGetValue()
    {
        var target = new ExternalManager<string>("initial");

        target.Value.Should().Be("initial");
        target.Value = "new";
        target.Value.Should().Be("new");
    }

    [Fact]
    public void ShouldThrow_IfNoValueSet()
    {
        var target = new ExternalManager<string>();

        target.Invoking(t => t.Value)
            .Should().Throw<InvalidOperationException>();
    }
}
