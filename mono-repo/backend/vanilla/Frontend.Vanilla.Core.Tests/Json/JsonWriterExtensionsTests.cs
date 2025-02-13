using System.IO;
using FluentAssertions;
using Frontend.Vanilla.Core.Json;
using Frontend.Vanilla.Testing.FluentAssertions;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Json;

public sealed class JsonWriterExtensionsTests
{
    [Fact]
    public void ShouldWriteProperty()
    {
        var str = new StringWriter();
        var writer = new JsonTextWriter(str);
        writer.WriteStartObject();

        // Act
        writer.WriteProperty("text", "bwin");
        writer.WriteProperty("number", 666);

        writer.WriteEndObject();
        writer.Close();
        str.ToString().Should().BeJson("{ text: 'bwin', number: 666 }");
    }
}
