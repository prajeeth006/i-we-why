using System;
using System.Text.RegularExpressions;
using FluentAssertions;
using Frontend.Vanilla.Core.Json.Converters;
using Frontend.Vanilla.Testing.FluentAssertions;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Json.Converters;

public class RegexStringJsonConverterTests : JsonConverterTestsBase
{
    protected override JsonConverter Target => new RegexStringJsonConverter();

    [Fact]
    public void Deserialize_ShouldBeCorrect()
    {
        // Act
        var regex = Deserialize<Regex>("'Hello BWIN'");

        regex.ToString().Should().Be("Hello BWIN");
        regex.Options.Should().Be(RegexOptions.Compiled | RegexOptions.IgnoreCase);
    }

    [Fact]
    public void Deserialize_ShouldThrow_IfInvalidRegex()
    {
        Action act = () => Deserialize<Regex>("'Hello ['");

        act.Should().Throw<JsonSerializationException>()
            .Which.InnerException.Message.Should().Contain("Hello [");
    }

    [Fact]
    public void Deserialize_ShouldThrow_IfNotString()
        => RunDeserializeInvalidTypeTest<Regex>("123");

    [Fact]
    public void Serialize_ShouldBeCorrect()
    {
        // Act
        var json = Serialize(new Regex("Hello BWIN"));

        json.Should().BeJson("'Hello BWIN'");
    }
}
