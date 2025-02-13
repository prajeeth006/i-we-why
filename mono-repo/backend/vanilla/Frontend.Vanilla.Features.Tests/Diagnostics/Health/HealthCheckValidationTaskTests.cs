using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Diagnostics.Health;
using Frontend.Vanilla.Features.Ioc;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Diagnostics.Health;

public class HealthCheckValidationTaskTests
{
    private readonly IBootTask target;
    private readonly Mock<IHealthCheck> check1;
    private readonly Mock<IHealthCheck> check2;

    public HealthCheckValidationTaskTests()
    {
        check1 = new Mock<IHealthCheck>();
        check2 = new Mock<IHealthCheck>();
        var config1 = Mock.Of<IConfigurationInfo>(c => c.FeatureName == "Vanilla.Foo");
        var config2 = Mock.Of<IConfigurationInfo>(c => c.FeatureName == "Vanilla.Bar");
        target = new HealthCheckValidationTask(new[] { check1.Object, check2.Object }, new[] { config1, config2 });

        check1.SetupGet(c => c.Metadata).Returns(GetMetadata("Test 1", config1.FeatureName));
        check2.SetupGet(c => c.Metadata).Returns(GetMetadata("Test 2", config2.FeatureName));
    }

    [Fact]
    public Task ShouldPass()
        => target.ExecuteAsync();

    [Theory]
    [InlineData("VANILLA.foo")]
    public async Task ShouldPass_IfConfigFeatureNameNullOrDifferentLetterCasing(string featureName)
    {
        check1.SetupGet(c => c.Metadata).Returns(GetMetadata("Test 1", featureName));
        await target.ExecuteAsync(); // Act
    }

    [Fact]
    public async Task ShouldThrow_IfNullMetadata()
    {
        check2.SetupGet(c => c.Metadata).Returns(() => null);
        await RunFailedTest(nameof(IHealthCheck.Metadata), "null");
    }

    [Fact]
    public async Task ShouldThrow_IfMetadataNotSingleton()
    {
        check2.SetupGet(c => c.Metadata).Returns(() => GetMetadata("Test 2"));
        await RunFailedTest(nameof(IHealthCheck.Metadata), "isn't a singleton");
    }

    [Fact]
    public async Task ShouldThrow_IfConfigFeatureNameNotFound()
    {
        check2.SetupGet(c => c.Metadata).Returns(GetMetadata("Test 2", "Vanilla.Lol"));
        await RunFailedTest($"{nameof(IHealthCheck.Metadata)}.{nameof(HealthCheckMetadata.ConfigurationFeatureName)}",
            "non-existent feature 'Vanilla.Lol'",
            "Vanilla.Foo",
            "Vanilla.Bar");
    }

    [Fact]
    public async Task ShouldThrow_IfConflictingName()
    {
        check2.SetupGet(c => c.Metadata).Returns(GetMetadata("Test 1"));
        await RunFailedTest($"{nameof(IHealthCheck.Metadata)}.{nameof(HealthCheckMetadata.Name)} 'Test 1'", check1.Object.ToString());
    }

    private async Task RunFailedTest(params string[] expectedMsg)
    {
        var act = target.ExecuteAsync;

        var ex = await act.Should().ThrowAsync<Exception>();
        ex.Which.Message.Should().Contain(check2.Object.ToString());
        ex.Which.InnerException?.Message.Should().ContainAll(expectedMsg);
    }

    private static HealthCheckMetadata GetMetadata(TrimmedRequiredString name, TrimmedRequiredString configName = null)
        => new (name, "Desc", "WTD", configurationFeatureName: configName);
}
