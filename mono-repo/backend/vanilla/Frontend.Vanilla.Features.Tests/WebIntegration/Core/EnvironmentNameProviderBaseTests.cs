using FluentAssertions;
using Frontend.Vanilla.Features.WebIntegration.Core;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Core;

public class EnvironmentNameProviderBaseTests
{
    [Theory]
    [InlineData("qa2", false)]
    [InlineData("production", false)]
    [InlineData("prod", true)]
    [InlineData("PROD", true)]
    public void ShouldInitializeCorrectly(string name, bool expectedIsProd)
    {
        // Act
        IEnvironmentNameProvider target = new EnvironmentNameProviderBase(name);

        target.EnvironmentName.Should().Be(name);
        target.IsProduction.Should().Be(expectedIsProd);
    }
}
