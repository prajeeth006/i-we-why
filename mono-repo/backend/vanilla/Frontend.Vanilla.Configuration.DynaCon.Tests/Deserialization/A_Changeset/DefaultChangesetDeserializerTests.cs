using System;
using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.B_Feature;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization.A_Changeset;

public sealed class DefaultChangesetDeserializerTests
{
    private Mock<IConfigurationInfo> fooInfo;
    private Mock<IConfigurationInfo> barInfo;
    private Mock<IFeatureDeserializer> featureDeserializer;
    private Mock<IConfigurationServiceUrls> urlBuilder;

    private Dictionary<string, IReadOnlyDictionary<string, KeyConfiguration>> configDtos;
    private VariationHierarchyResponse ctxHierarchy;
    private Dictionary<string, KeyConfiguration> fooDto;
    private Dictionary<string, KeyConfiguration> barDto;
    private FeatureConfiguration fooConfig1;
    private FeatureConfiguration fooConfig2;
    private FeatureConfiguration barConfig;

    public interface IFooConfig { }

    public interface IBarConfig { }

    public DefaultChangesetDeserializerTests()
    {
        fooInfo = new Mock<IConfigurationInfo>();
        barInfo = new Mock<IConfigurationInfo>();
        featureDeserializer = new Mock<IFeatureDeserializer>();
        urlBuilder = new Mock<IConfigurationServiceUrls>();

        configDtos = new Dictionary<string, IReadOnlyDictionary<string, KeyConfiguration>>();
        ctxHierarchy = TestCtxHierarchy.Get();
        fooDto = new Dictionary<string, KeyConfiguration> { { "Prop", TestConfigDto.CreateKey() } };
        barDto = new Dictionary<string, KeyConfiguration>();
        fooConfig1 = new FeatureConfiguration("Foo Obj 1", TestVarCtx.Get());
        fooConfig2 = new FeatureConfiguration("Foo Obj 2", TestVarCtx.Get());
        barConfig = new FeatureConfiguration("Bar Obj", TestVarCtx.Get());

        fooInfo.SetupGet(i => i.FeatureName).Returns("Vanilla.Foo");
        fooInfo.SetupGet(i => i.ServiceType).Returns(typeof(IFooConfig));
        barInfo.SetupGet(i => i.FeatureName).Returns("Vanilla.Bar");
        barInfo.SetupGet(i => i.ServiceType).Returns(typeof(IBarConfig));
        urlBuilder.Setup(b => b.Changeset(123)).Returns(new HttpUri("http://dynacon/configs/123"));
        configDtos.Add("Vanilla.Foo", fooDto);
        configDtos.Add("vanilla.bar", barDto); // Should handle different letter casing
        featureDeserializer.Setup(d => d.Deserialize(fooInfo.Object, fooDto, ctxHierarchy))
            .Returns(new[] { fooConfig1, fooConfig2 }.WithWarnings<IReadOnlyList<FeatureConfiguration>>("Foo Warning 1", "Foo Warning 2"));
        featureDeserializer.Setup(d => d.Deserialize(barInfo.Object, barDto, ctxHierarchy))
            .Returns(new[] { barConfig }.WithWarnings<IReadOnlyList<FeatureConfiguration>>("Bar Warning"));
    }

    private IChangesetDeserializer GetTarget()
        => new DefaultChangesetDeserializer(new[] { fooInfo.Object, barInfo.Object }, featureDeserializer.Object, urlBuilder.Object);

    private ConfigurationResponse GetChangesetDto()
        => TestConfigDto.Create(configs: configDtos);

    [Fact]
    public void Constructor_ShouldThrow_IfDuplicateFeatureName()
    {
        barInfo.SetupGet(i => i.FeatureName).Returns("Vanilla.Foo");
        new Func<object>(GetTarget).Should().Throw<DuplicateException>().Which.ConflictingValue.Should().Be("Vanilla.Foo");
    }

    [Fact]
    public void Constructor_ShouldThrow_IfDuplicateServiceType()
    {
        barInfo.SetupGet(i => i.ServiceType).Returns(typeof(IFooConfig));
        new Func<object>(GetTarget).Should().Throw<DuplicateException>().Which.ConflictingValue.Should().Be(typeof(IFooConfig));
    }

    [Theory, EnumData(typeof(ConfigurationSource))]
    internal void ShouldDeserializeAllConfigs(ConfigurationSource source)
    {
        var dto = GetChangesetDto();

        // Act
        var result = GetTarget().Deserialize(dto, ctxHierarchy, source);

        result.Id.Should().Be(dto.ChangesetId);
        result.ValidFrom.Value.Should().Be(dto.ValidFrom);
        result.Source.Should().Be(source);
        result.Dto.Should().BeSameAs(dto);
        result.Url.Should().Be(new Uri("http://dynacon/configs/123"));
        result.Features.Keys.Should().BeEquivalentTo<TrimmedRequiredString>("Vanilla.Foo", "Vanilla.Bar");
        result.Features["Vanilla.Foo"].Should().Equal(fooConfig1, fooConfig2);
        result.Features["Vanilla.Bar"].Should().Equal(barConfig);
        result.Warnings.Should().BeEquivalentTo<TrimmedRequiredString>(
            "Feature 'Vanilla.Foo': Foo Warning 1",
            "Feature 'Vanilla.Foo': Foo Warning 2",
            "Feature 'Vanilla.Bar': Bar Warning");
    }

    [Theory, EnumData(typeof(ConfigurationSource))]
    internal void ShouldThrow_IfMissingDataForFeatureOrDeserializationError(ConfigurationSource source)
    {
        configDtos.Remove("vanilla.bar");
        var dto = GetChangesetDto();
        var innerEx = new Exception("Deserialization error");
        featureDeserializer.SetupWithAnyArgs(d => d.Deserialize(null, null, null)).Throws(innerEx);
        var target = GetTarget();

        Action act = () => target.Deserialize(dto, ctxHierarchy, source);

        var ex = act.Should().Throw<ChangesetDeserializationException>().Which;
        ex.Message.Should().Contain("Failed deserializing changeset 123.");
        ex.InnerExceptions.Count.Should().Be(2);
        ex.InnerExceptions[0].Message.Should().Be("Failed deserializing " + fooInfo.Object);
        ex.InnerExceptions[0].InnerException.Should().BeSameAs(innerEx);
        ex.InnerExceptions[1].Message.Should().StartWith("Missing feature 'Vanilla.Bar' in the response from DynaCon.");
        ex.FailedChangeset.Dto.Should().BeSameAs(dto);
        ex.FailedChangeset.Source.Should().Be(source);
        ex.FailedChangeset.Url.Should().Be(new Uri("http://dynacon/configs/123"));
    }

    [Fact]
    public void ShouldWarnAboutUnusedFeatures()
    {
        configDtos.Add("Vanilla.Unused", new Dictionary<string, KeyConfiguration>());
        configDtos.Add("Portal.Unused", new Dictionary<string, KeyConfiguration>());

        // Act
        var result = GetTarget().Deserialize(GetChangesetDto(), ctxHierarchy, default);

        result.Warnings.Should().ContainAll(
            "Data of the feature 'Vanilla.Unused' in the response from DynaCon wasn't used for deserialization of any configuration model. Consider removing it (in new service version if the feature was used in the past).",
            "Data of the feature 'Portal.Unused' in the response from DynaCon wasn't used for deserialization of any configuration model. Consider removing it (in new service version if the feature was used in the past).");
    }
}
