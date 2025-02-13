using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Json.Converters.Abstract;

public sealed class JsonWriteConverterTests
{
    private JsonConverterBase target;

    public JsonWriteConverterTests()
        => target = Mock.Of<JsonWriteConverter>();

    [Fact]
    public void CanRead_ShouldBeFalse()
        => target.CanRead.Should().BeFalse();

    [Fact]
    public void Read_ShouldThrow()
        => new Action(() => target.Read(null, null, null, null))
            .Should().Throw<NotSupportedException>()
            .Which.Message.Should().Contain(target.GetType().ToString());
}
