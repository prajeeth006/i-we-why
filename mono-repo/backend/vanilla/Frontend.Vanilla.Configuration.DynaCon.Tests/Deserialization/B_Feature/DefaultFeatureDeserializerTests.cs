using System;
using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.B_Feature;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.C_Instance;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.D_InstanceJson;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization.B_Feature;

public sealed class DefaultFeatureDeserializerTests
{
    private IFeatureDeserializer target;
    private Mock<IInstanceJsonResolver> jsonResolver;
    private Mock<IInstanceDeserializer> instanceDeserializer;
    private IConfigurationInfo info;
    private IReadOnlyDictionary<string, KeyConfiguration> featureDto;
    private VariationHierarchyResponse varHierarchy;
    private VariationContext context1;
    private VariationContext context2;
    private VariationContext context3;
    private JObject json1;
    private JObject json2;
    private JObject json3;

    public DefaultFeatureDeserializerTests()
    {
        jsonResolver = new Mock<IInstanceJsonResolver>();
        instanceDeserializer = new Mock<IInstanceDeserializer>();
        target = new DefaultFeatureDeserializer(jsonResolver.Object, instanceDeserializer.Object);

        info = Mock.Of<IConfigurationInfo>();
        featureDto = new Dictionary<string, KeyConfiguration>();
        varHierarchy = TestCtxHierarchy.Get();
        context1 = TestVarCtx.Get(product: new[] { "casino" });
        context2 = TestVarCtx.Get(label: new[] { "bwin.com" });
        context3 = TestVarCtx.Get(channel: new[] { "desktop" }, label: new[] { "bwin.es" });
        json1 = JObject.Parse("{ Value: 111 }");
        json2 = JObject.Parse("{ Value: 222 }");
        json3 = JObject.Parse("{ Value: 333 }");

        jsonResolver.Setup(r => r.Resolve(featureDto, varHierarchy)).Returns(new[] { (json1, context1), (json2, context2), (json3, context3) });
    }

    [Fact]
    public void ShouldDeserializeConfigForEachContext()
    {
        var config1 = new object();
        var config2 = new object();
        var config3 = new object();
        instanceDeserializer.Setup(d => d.Deserialize(info, json1)).Returns(config1.WithWarnings("Warn 1.1", "Warn 1.2"));
        instanceDeserializer.Setup(d => d.Deserialize(info, json2)).Returns(config2);
        instanceDeserializer.Setup(d => d.Deserialize(info, json3)).Returns(config3.WithWarnings("Warn 3"));

        // Act
        var result = target.Deserialize(info, featureDto, varHierarchy);

        result.Value.Should().HaveCount(3);
        VerifyConfig(0, config1, context1);
        VerifyConfig(1, config2, context2);
        VerifyConfig(2, config3, context3);
        result.Warnings.Should().Equal("Warn 1.1", "Warn 1.2", "Warn 3");

        void VerifyConfig(int index, object expectedConfig, VariationContext expectedContext)
        {
            result.Value[index].Instance.Should().BeSameAs(expectedConfig);
            ((object)result.Value[index].Context).Should().BeSameAs(expectedContext);
        }
    }

    [Fact]
    public void ShouldAggregateErrors_IfInstanceDeserializationFailed()
    {
        var ex1 = new Exception("Error 1");
        var ex2 = new Exception("Error 2");
        instanceDeserializer.Setup(d => d.Deserialize(info, json1)).Throws(ex1);
        instanceDeserializer.Setup(d => d.Deserialize(info, json2)).Returns(new object());
        instanceDeserializer.Setup(d => d.Deserialize(info, json3)).Throws(ex2);

        Action act = () => target.Deserialize(info, featureDto, varHierarchy);

        var aex = act.Should().Throw<AggregateException>().WithMessage(DefaultFeatureDeserializer.ErrorMessage + "*").Which;
        aex.InnerExceptions.Should().HaveCount(2);
        aex.InnerExceptions[0].Should().Match<InstanceDeserializationException>(e => e.Context == context1 && e.InnerException == ex1);
        aex.InnerExceptions[1].Should().Match<InstanceDeserializationException>(e => e.Context == context3 && e.InnerException == ex2);
    }
}
