using System;
using FluentAssertions;
using Frontend.Vanilla.Features.WebIntegration;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration;

public sealed class SingleDomainAppConfigurationTests
{
    private readonly ISingleDomainAppConfiguration target;
    private readonly Mock<IConfiguration> configuration;

    public SingleDomainAppConfigurationTests()
    {
        configuration = new Mock<IConfiguration>();
        target = new SingleDomainAppConfiguration(configuration.Object);
    }

    [Theory]
    [InlineData(null, false)]
    [InlineData("false", false)]
    [InlineData("true", true)]
    public void ShouldReadCorrectly(string input, bool expected)
    {
        configuration.Setup(c => c.GetSection("SingleDomainApp")).Returns(Mock.Of<IConfigurationSection>(s => s.Value == input && s.Path == "SingleShit"));

        // Act
        target.IsEnabled().Should().Be(expected);
    }

    [Fact]
    public void ShouldThrow_IfInvalidValue()
        => new Action(() => target.IsEnabled())
            .Should().Throw<AppSettingsJsonException>();
}
