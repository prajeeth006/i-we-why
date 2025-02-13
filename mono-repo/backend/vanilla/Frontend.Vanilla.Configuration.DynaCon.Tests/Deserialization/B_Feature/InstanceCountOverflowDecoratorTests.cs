using System;
using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.B_Feature;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization.B_Feature;

public sealed class InstanceCountOverflowDecoratorTests
{
    private IFeatureDeserializer target;
    private Mock<IFeatureDeserializer> inner;
    private IConfigurationInfo info;
    private Dictionary<string, KeyConfiguration> featureDto;
    private VariationHierarchyResponse varHierarchy;
    private Mock<IReadOnlyList<FeatureConfiguration>> innerConfigs;
    private IReadOnlyList<TrimmedRequiredString> innerWarnings;

    public InstanceCountOverflowDecoratorTests()
    {
        inner = new Mock<IFeatureDeserializer>();
        target = new InstanceCountOverflowDecorator(inner.Object);

        info = Mock.Of<IConfigurationInfo>();
        featureDto = new Dictionary<string, KeyConfiguration>();
        varHierarchy = TestCtxHierarchy.Get();
        innerConfigs = new Mock<IReadOnlyList<FeatureConfiguration>>();
        innerWarnings = Warnings.Get("Inner Warning 1", "Inner Warning 2");

        inner.Setup(i => i.Deserialize(info, featureDto, varHierarchy)).Returns(innerConfigs.Object.WithWarnings(innerWarnings));
    }

    [Theory]
    [InlineData(1)]
    [InlineData(66)]
    [InlineData(100)]
    public void ShouldReturnInner_IfSustainableConfigCount(int count)
    {
        innerConfigs.SetupGet(c => c.Count).Returns(count);

        // Act
        var result = target.Deserialize(info, featureDto, varHierarchy);

        result.Value.Should().BeSameAs(innerConfigs.Object);
        result.Warnings.Should().Equal(innerWarnings);
    }

    [Theory]
    [InlineData(100_001)]
    [InlineData(666_123)]
    public void ShouldThrow_IfExtremelyManyConfigs(int count)
    {
        innerConfigs.SetupGet(c => c.Count).Returns(count);
        featureDto.Add("Foo", new KeyConfiguration("dummy", new[]
        {
            new ValueConfiguration("v1", new Dictionary<string, string> { { "product", "sports" } }),
            new ValueConfiguration("v2", new Dictionary<string, string> { { "label", "bwin.com" } }),
        }));
        featureDto.Add("Bar", new KeyConfiguration("dummy", new[]
        {
            new ValueConfiguration("v3", new Dictionary<string, string> { { "product", "sports" } }),
            new ValueConfiguration("v4", new Dictionary<string, string>()),
        }));

        Action act = () => target.Deserialize(info, featureDto, varHierarchy);

        act.Should().Throw<Exception>().WithMessage(
            $"There are {count} configuration instances as a result of possible variation context combinations."
            + " This is not sustainable for the app because of resolution performance and amount of consumed resources. Please reduce the number of different contexts/values in DynaCon."
            + " Contexts from input DTO: [{\"product\":\"sports\"},{\"label\":\"bwin.com\"},{}]");
    }

    [Theory]
    [InlineData(101)]
    [InlineData(666)]
    [InlineData(100_000)]
    public void ShouldReturnWarnings_IfTooManyConfigs(int count)
    {
        innerConfigs.SetupGet(c => c.Count).Returns(count);

        // Act
        var result = target.Deserialize(info, featureDto, varHierarchy);

        result.Value.Should().BeSameAs(innerConfigs.Object);
        result.Warnings.Should().Equal(innerWarnings.Append<TrimmedRequiredString>(
            $"There are too many {count} configuration instances. This may impact resolution performance and amount of consumed resources."));
    }
}
