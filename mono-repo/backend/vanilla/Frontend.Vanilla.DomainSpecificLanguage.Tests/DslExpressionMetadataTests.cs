using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests;

public class DslExpressionMetadataTests
{
    [Theory]
    [InlineData(ValueVolatility.Client, false, false)]
    [InlineData(ValueVolatility.Server, false, true)]
    [InlineData(ValueVolatility.Static, false, true)]
    [InlineData(ValueVolatility.Client, true, false)]
    [InlineData(ValueVolatility.Server, false, false)]
    public void ShouldCreateCorrectly(
        ValueVolatility volatility,
        bool clientSideOnly,
        bool alreadyEvaluated)
    {
        var target = new DslExpressionMetadata(volatility, clientSideOnly, alreadyEvaluated);

        target.Volatility.Should().Be(volatility);
        target.IsClientOnly.Should().Be(clientSideOnly);
        target.IsAlreadyEvaluated.Should().Be(alreadyEvaluated);
    }

    [Fact]
    public void ToString_ShouldIncludeAllProperties()
    {
        var target = new DslExpressionMetadata(ValueVolatility.Static, true, false);
        target.ToString().Should().Be("Volatility=Static, ClientSideOnly=True, AlreadyEvaluated=False");
    }
}
