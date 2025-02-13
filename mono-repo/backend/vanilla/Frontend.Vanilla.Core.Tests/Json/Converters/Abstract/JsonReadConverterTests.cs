using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Json.Converters.Abstract;

public sealed class JsonReadConverterTests
{
    private JsonConverterBase target;

    public JsonReadConverterTests()
        => target = Mock.Of<JsonReadConverter>();

    [Fact]
    public void CanWrite_ShouldBeFalse()
        => target.CanWrite.Should().BeFalse();

    [Fact]
    public void Read_ShouldThrow()
        => new Action(() => target.Write(null, null, null))
            .Should().Throw<NotSupportedException>()
            .Which.Message.Should().Contain(target.GetType().ToString());
}
