using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Json.Converters.Abstract;

public sealed class JsonWriteConverterGenericTests
{
    public interface IFooParent { }

    public interface IFoo : IFooParent { }

    public interface IFooChild : IFoo { }

    private JsonWriteConverter target;
    private Mock<JsonWriteConverter<IFoo>> underlyingMock;

    public JsonWriteConverterGenericTests()
    {
        underlyingMock = new Mock<JsonWriteConverter<IFoo>>();
        target = underlyingMock.Object;
    }

    [Theory]
    [InlineData(typeof(IFoo), true)]
    [InlineData(typeof(IFooChild), true)]
    [InlineData(typeof(IFooParent), false)]
    [InlineData(typeof(object), false)]
    public void CanConvert_ShouldSupportAssignableTypes(Type type, bool expected)
        => target.CanConvert(type).Should().Be(expected);

    [Fact]
    public void Write_ShouldDowncast()
    {
        var foo = Mock.Of<IFoo>();
        var writer = Mock.Of<JsonWriter>();
        var serializer = JsonSerializer.Create();

        target.Write(writer, foo, serializer); // Act

        underlyingMock.Verify(x => x.Write(writer, foo, serializer));
    }
}
