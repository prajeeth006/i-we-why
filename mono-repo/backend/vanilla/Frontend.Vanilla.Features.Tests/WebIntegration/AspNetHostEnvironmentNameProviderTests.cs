using FluentAssertions;
using Frontend.Vanilla.Features.WebIntegration;
using Microsoft.Extensions.Hosting;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration;

public sealed class AspNetHostEnvironmentNameProviderTests
{
    [Theory]
    [InlineData("foo")]
    [InlineData("FOO")]
    public void ShouldTakeFromHostEnvironment(string environment)
    {
        var hostEnvironment = Mock.Of<IHostEnvironment>(e => e.EnvironmentName == environment);

        // Act
        var target = new AspNetHostEnvironmentNameProvider(hostEnvironment);

        target.EnvironmentName.Should().Be("foo");
    }
}
