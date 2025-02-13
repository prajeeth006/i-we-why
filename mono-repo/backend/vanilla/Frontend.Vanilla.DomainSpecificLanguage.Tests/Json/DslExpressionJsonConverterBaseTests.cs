using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.DomainSpecificLanguage.Json;
using Frontend.Vanilla.DomainSpecificLanguage.Tracing;
using Moq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Json;

public sealed class DslExpressionJsonConverterBaseTests
{
    private JsonConverterBase target;
    private Mock<DslExpressionJsonConverterBase> underlyingMock;

    public DslExpressionJsonConverterBaseTests()
    {
        underlyingMock = new Mock<DslExpressionJsonConverterBase>();
        target = underlyingMock.Object;
    }

    [Theory]
    [InlineData(typeof(IDslExpression<bool>), true)]
    [InlineData(typeof(IDslExpression<object>), true)]
    [InlineData(typeof(IDslExpression<string>), true)]
    [InlineData(typeof(TracedDslExpression<string>), true)]
    [InlineData(typeof(DslExpression<string>), true)]
    [InlineData(typeof(List<string>), false)]
    [InlineData(typeof(IList<string>), false)]
    [InlineData(typeof(string), false)]
    [InlineData(typeof(object), false)]
    public void CanConvert_ShouldCalculateCorrectly(Type objectType, bool expected)
        => target.CanConvert(objectType).Should().Be(expected);

    [Fact]
    public void Read_ShouldDelegateToGenericMethod()
    {
        var jsonValue = new JObject();
        var deserializedExpr = Mock.Of<IDslExpression<string>>();
        var reader = Mock.Of<JsonReader>(r => r.Value == jsonValue);
        underlyingMock.Setup(c => c.Read<string>(jsonValue)).Returns(deserializedExpr);

        // Act
        var result = target.Read(reader, typeof(IDslExpression<string>), null, null);

        result.Should().BeSameAs(deserializedExpr);
    }

    [Fact]
    public void Write_ShouldDelegateToGenericMethod()
    {
        var expr = Mock.Of<IDslExpression<string>>();
        var writer = Mock.Of<JsonWriter>();

        // Act
        target.Write(writer, expr, null);

        underlyingMock.Verify(c => c.Write(writer, expr));
    }
}
