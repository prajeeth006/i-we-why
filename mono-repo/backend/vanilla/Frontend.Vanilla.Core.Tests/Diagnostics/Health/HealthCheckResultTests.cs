using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Diagnostics.Health;

public class HealthCheckResultTests
{
    [Theory, BooleanData]
    public void CreateSuccess_ShouldBePassed(bool withDetails)
    {
        var details = withDetails ? "My details" : null;

        var target = HealthCheckResult.CreateSuccess(details); // Act

        target.Error.Should().BeNull();
        target.Details.Should().Be(details);
    }

    [Fact]
    public void Success_ShouldBePassed()
    {
        HealthCheckResult.Success.Error.Should().BeNull();
        HealthCheckResult.Success.Details.Should().BeNull();
    }

    [Fact]
    public void DisabledFeature_ShouldBePassed()
    {
        HealthCheckResult.DisabledFeature.Error.Should().BeNull();
        HealthCheckResult.DisabledFeature.Details.Should().Be("The feature is disabled.");
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void CreateFailed_ShouldNotBePassed(bool withDetails)
    {
        var details = withDetails ? "My details" : null;

        var target = HealthCheckResult.CreateFailed("My error", details); // Act

        target.Error.Should().Be("My error");
        target.Details.Should().Be(details);
    }

    [Fact]
    public void CreateFailed_ShouldThrow_IfNoError()
    {
        var ex = Assert.Throws<ArgumentNullException>(() => HealthCheckResult.CreateFailed(null));
        ex.ParamName.Should().Be("error");
    }
}
