using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Json.Converters.Abstract;

public sealed class JsonConverterBaseGenericTests
{
    public class FooParent { }

    public class Foo : FooParent { }

    public class FooChild : Foo { }

    private JsonConverterBase target;
    private Mock<JsonConverterBase<Foo>> underlyingMock;
    private JsonSerializer serializer;

    public JsonConverterBaseGenericTests()
    {
        underlyingMock = new Mock<JsonConverterBase<Foo>>();
        target = underlyingMock.Object;
        serializer = JsonSerializer.Create();
    }

    [Theory]
    [InlineData(typeof(Foo), true)]
    [InlineData(typeof(FooChild), true)]
    [InlineData(typeof(FooParent), false)]
    [InlineData(typeof(object), false)]
    [InlineData(typeof(string), false)]
    public void CanConvert_ShouldBeTrueOnlyForThatType(Type type, bool expected)
        => target.CanConvert(type).Should().Be(expected);

    public static readonly IEnumerable<object[]> TestValues = new[]
    {
        new object[] { new Foo() },
        new object[] { new FooChild() },
    };

    [Theory]
    [MemberData(nameof(TestValues))]
    public void Read_ShouldDowncast<T>(T value)
        where T : Foo
    {
        var reader = Mock.Of<JsonReader>();
        var existing = Mock.Of<FooChild>();
        underlyingMock.Setup(x => x.Read(reader, typeof(T), serializer)).Returns(value);

        var result = target.Read(reader, typeof(T), existing, serializer); // Act

        result.Should().BeSameAs(value);
    }

    [Theory]
    [MemberData(nameof(TestValues))]
    public void Write_ShouldDowncast<T>(T value)
        where T : Foo
    {
        var writer = Mock.Of<JsonWriter>();

        target.Write(writer, value, serializer); // Act

        underlyingMock.Verify(x => x.Write(writer, value, serializer));
    }
}
