using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.D_InstanceJson;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.E_Context;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization.D_InstanceJson;

public sealed class DefaultInstanceJsonResolverTests
{
    private IInstanceJsonResolver target;
    private Mock<IContextEnumerator> combiner;
    private Mock<IInstanceJsonBuilder> jsonBuilder;

    public DefaultInstanceJsonResolverTests()
    {
        combiner = new Mock<IContextEnumerator>();
        jsonBuilder = new Mock<IInstanceJsonBuilder>();
        target = new DefaultInstanceJsonResolver(combiner.Object, jsonBuilder.Object);
    }

    [Fact]
    public void ShouldBuildJsonForEachContext()
    {
        var context1 = TestVarCtx.Get(product: new[] { "sports" });
        var context2 = TestVarCtx.Get(label: new[] { "bwin.com" });
        var json1 = new JObject();
        var json2 = new JObject();
        var featureDto = new Dictionary<string, KeyConfiguration>();
        var ctxHierarchy = TestCtxHierarchy.Get();
        combiner.Setup(c => c.GetContexts(featureDto, ctxHierarchy)).Returns(new[] { context1, context2 });
        jsonBuilder.Setup(b => b.BuildForContext(featureDto, context1, ctxHierarchy)).Returns(json1);
        jsonBuilder.Setup(b => b.BuildForContext(featureDto, context2, ctxHierarchy)).Returns(json2);

        // Act
        var result = target.Resolve(featureDto, ctxHierarchy).ToList();

        result.Should().HaveCount(2);
        result[0].context.Should().BeSameAs(context1);
        result[0].instanceJson.Should().BeSameAs(json1);
        result[1].context.Should().BeSameAs(context2);
        result[1].instanceJson.Should().BeSameAs(json2);
    }
}
