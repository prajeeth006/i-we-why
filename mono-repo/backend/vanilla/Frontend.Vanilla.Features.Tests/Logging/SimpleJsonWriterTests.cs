#nullable enable

using System.IO;
using FluentAssertions;
using Frontend.Vanilla.Features.Logging;
using Serilog.Formatting.Json;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Logging;

public class SimpleJsonWriterTests
{
    [Fact]
    public void ShouldWriteJsonCorrectly()
    {
        var strWriter = new StringWriter();
        var target = new SimpleJsonWriter(strWriter, new JsonValueFormatter());

        // Act
        target.StartObject();
        target.WritePropertyName("Nested");
        target.StartObject();
        target.WriteProperty("Foo", "111");
        target.EndObject();
        target.WriteProperty("NullValue", (string?)null);
        target.WriteProperty("Bar", "222");
        target.EndObject();

        strWriter.ToString().Should().Be(@"{""Nested"":{""Foo"":""111""},""NullValue"":null,""Bar"":""222""}");
    }
}
