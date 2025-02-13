using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.Json;
using Frontend.Vanilla.Testing.FluentAssertions;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Json;

public sealed class ClientEvaluationResultJsonConverterTests
{
    private JsonSerializerSettings settings;

    public ClientEvaluationResultJsonConverterTests()
    {
        var target = new ClientEvaluationResultJsonConverter();
        settings = new JsonSerializerSettings { Converters = { target } };
    }

    [Fact]
    public void ShouldSerializeClientExpression()
    {
        var result = ClientEvaluationResult<bool>.FromClientExpression("c.Foo");
        var json = JsonConvert.SerializeObject(result, settings); // Act
        json.Should().BeJson("'c.Foo'");
    }

    [Fact]
    public void ShouldSerializeFinalValue()
    {
        var result = ClientEvaluationResult<string>.FromValue("foo");
        var json = JsonConvert.SerializeObject(result, settings); // Act
        json.Should().BeJson(@"'\""foo\""'");
    }

    [Fact]
    public void ShouldSerializeFinalValue_boolean()
    {
        var result = ClientEvaluationResult<bool>.FromValue(true);
        var json = JsonConvert.SerializeObject(result, settings); // Act
        json.Should().BeJson(@"'true'");
    }
}
