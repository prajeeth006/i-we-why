using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.B_Feature;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization.B_Feature;

public sealed class PropertyMismatchDecoratorTests
{
    private IFeatureDeserializer target;
    private Mock<IFeatureDeserializer> inner;
    private Mock<IConfigurationInfo> info;
    private Dictionary<string, KeyConfiguration> featureDto;
    private VariationHierarchyResponse varHierarchy;
    private IReadOnlyList<FeatureConfiguration> innerConfigs;
    private TrimmedRequiredString[] innerWarnings;

    public PropertyMismatchDecoratorTests()
    {
        inner = new Mock<IFeatureDeserializer>();
        target = new PropertyMismatchDecorator(inner.Object);

        innerConfigs = Mock.Of<IReadOnlyList<FeatureConfiguration>>();
        innerWarnings = new TrimmedRequiredString[] { "Inner 1", "Inner 2" };
        info = new Mock<IConfigurationInfo>();
        featureDto = new Dictionary<string, KeyConfiguration>();
        varHierarchy = TestCtxHierarchy.Get();

        inner.Setup(i => i.Deserialize(info.Object, featureDto, varHierarchy)).Returns(innerConfigs.WithWarnings(innerWarnings));
        featureDto["ok"] = TestConfigDto.CreateKey();
    }

    [Fact]
    public void ShouldAddWarningsAboutMistmachedProperties()
    {
        info.SetupGet(i => i.ImplementationParameters).Returns(new[]
        {
            Mock.Of<IConfigurationImplementationParameter>(p => p.Name == "MissingParam"),
            Mock.Of<IConfigurationImplementationParameter>(p => p.Name == "OK"), // Should handle different letter casing
        });
        featureDto["UnusedParam"] = TestConfigDto.CreateKey();

        // Act
        var result = target.Deserialize(info.Object, featureDto, varHierarchy);

        result.Value.Should().BeSameAs(innerConfigs);
        result.Warnings.Should().BeEquivalentTo(innerWarnings.Append<TrimmedRequiredString>(
            "Missing key MissingParam in the response from DynaCon.",
            "There is unused key UnusedParam in the response from DynaCon."));
    }

    [Fact]
    public void ShouldNotModifyResult_IfNoMistmach()
    {
        info.SetupGet(i => i.ImplementationParameters).Returns(new[] { Mock.Of<IConfigurationImplementationParameter>(p => p.Name == "ok") });
        RunAndExpectInner();
    }

    [Fact]
    public void ShouldNotModifyResult_IfNoImplementationParameters()
    {
        info.SetupGet(i => i.ImplementationParameters).Returns(() => null);
        RunAndExpectInner();
    }

    private void RunAndExpectInner()
    {
        var result = target.Deserialize(info.Object, featureDto, varHierarchy); // Act

        result.Value.Should().BeSameAs(innerConfigs);
        result.Warnings.Should().Equal(innerWarnings);
    }
}
