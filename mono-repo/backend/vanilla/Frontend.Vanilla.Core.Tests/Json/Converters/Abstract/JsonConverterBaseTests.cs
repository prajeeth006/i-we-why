using System;
using System.Collections.Generic;
using System.IO;
using FluentAssertions;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Newtonsoft.Json;
using Xunit;
using Xunit.Sdk;

namespace Frontend.Vanilla.Core.Tests.Json.Converters.Abstract;

public sealed class JsonConverterBaseTests
{
    private JsonConverter target;
    private Mock<JsonConverterBase> underlyingMock;
    private JsonSerializer serializer;

    public JsonConverterBaseTests()
    {
        underlyingMock = new Mock<JsonConverterBase>();
        target = underlyingMock.Object;
        serializer = JsonSerializer.Create();
    }

    [Fact]
    public void ReadJson_ShouldDelegate()
    {
        var reader = GetReader();
        underlyingMock.Setup(x => x.Read(reader, typeof(ITest), "existing", serializer)).Returns("value");

        var result = target.ReadJson(reader, typeof(ITest), "existing", serializer); // Act

        result.Should().BeSameAs("value");
    }

    public static readonly IEnumerable<object[]> NullTokens = new[]
    {
        new object[] { JsonToken.Null },
        new object[] { JsonToken.Undefined },
    };

    public static readonly IEnumerable<object[]> TypesNullTokens = new[]
    {
        new object[] { typeof(ITest), JsonToken.Null },
        new object[] { typeof(int?), JsonToken.Null },
        new object[] { typeof(ITest), JsonToken.Undefined },
        new object[] { typeof(int?), JsonToken.Undefined },
    };

    [Theory]
    [MemberData(nameof(TypesNullTokens))]
    public void ReadJson_ShouldReturnNull_IfNullRead(Type typeToRead, JsonToken nullToken)
    {
        var reader = GetReader(nullToken);

        var result = target.ReadJson(reader, typeToRead, "existing", serializer); // Act

        result.Should().BeNull();
        underlyingMock.VerifyWithAnyArgs(x => x.Read(null, null, null, null), Times.Never);
    }

    [Theory]
    [MemberData(nameof(NullTokens))]
    public void ReadJson_ShouldThrow_IfNullRead_ButNotSupported(JsonToken nullToken)
    {
        var reader = GetReader(nullToken);

        var ex = RunReadExceptionTest(reader, typeof(int)); // Act

        ex.Message.Should().StartWith("Null");
    }

    [Fact]
    public void ReadJson_ShouldWrapExceptions()
    {
        var reader = GetReader();
        var innerEx = new Exception("Oups");
        underlyingMock.Setup(x => x.Read(reader, typeof(ITest), "existing", serializer)).Throws(innerEx);

        var ex = RunReadExceptionTest(reader, typeof(ITest)); // Act

        ex.Should().BeSameAs(innerEx);
    }

    private static JsonReader GetReader(JsonToken currentToken = JsonToken.String)
        => Mock.Of<JsonReader>(r => r.TokenType == currentToken && r.Path == "Test[7].Path");

    private Exception RunReadExceptionTest(JsonReader reader, Type typeToRead)
        => new Action(() => target.ReadJson(reader, typeToRead, "existing", serializer))
            .Should().Throw<JsonSerializationException>($"Failed deserializing {typeToRead} at path 'Test[7].Path'.")
            .Which.InnerException;

    [Fact]
    public void WriteJson_ShouldDelegate()
    {
        var writer = Mock.Of<JsonWriter>();

        target.WriteJson(writer, "value", serializer); // Act

        underlyingMock.Verify(x => x.Write(writer, "value", serializer));
    }

    [Fact]
    public void WriteJson_ShouldWrapExceptions()
    {
        var writer = new JsonTextWriter(new StringWriter()); // Path can't be mocked
        writer.WriteStartObject();
        writer.WritePropertyName("Test");

        var innerEx = new Exception("Oups");
        underlyingMock.Setup(x => x.Write(writer, "testValue", serializer)).Throws(innerEx);

        var act = () => target.WriteJson(writer, "testValue", serializer); // Act

        act.Should().Throw<JsonSerializationException>()
            .WithMessage("Failed serializing 'testValue' of type System.String at path 'Test'.")
            .Which.InnerException.Should().BeSameAs(innerEx);
    }
}
