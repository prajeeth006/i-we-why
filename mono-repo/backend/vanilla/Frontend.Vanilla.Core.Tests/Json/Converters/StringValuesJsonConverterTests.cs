using FluentAssertions;
using Frontend.Vanilla.Core.Json.Converters;
using Frontend.Vanilla.Testing.FluentAssertions;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Json.Converters;

public class StringValuesJsonConverterTests : JsonConverterTestsBase
{
    protected override JsonConverter Target => new StringValuesJsonConverter();

    public static TheoryData<string, StringValues> TestCases => new TheoryData<string, StringValues>
    {
        { "'hello'", "hello" },
        { "['hello', 'world']", new[] { "hello", "world" } },
    };

    [Theory, MemberData(nameof(TestCases))]
    public void Deserialize_ShouldBeCorrect(string json, StringValues expectedValues)
    {
        // Act
        var values = Deserialize<StringValues>(json);

        values.Should().BeEquivalentTo(expectedValues);
    }

    [Fact]
    public void Deserialize_ShouldThrow_IfNotString()
        => RunDeserializeInvalidTypeTest<StringValues>("123");

    [Theory, MemberData(nameof(TestCases))]
    public void SerializeShouldBeCorrect(string expectedJson, StringValues values)
    {
        // Act
        var json = Serialize(values);

        json.Should().BeJson(expectedJson);
    }
}
