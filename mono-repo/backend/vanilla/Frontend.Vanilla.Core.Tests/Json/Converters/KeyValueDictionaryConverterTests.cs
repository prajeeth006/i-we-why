using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Json.Converters;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.FluentAssertions;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Json.Converters;

public class KeyValueDictionaryConverterTests : JsonConverterTestsBase
{
    protected override JsonConverter Target => new KeyValueDictionaryConverter();

    public static IEnumerable<object[]> TestCases => new[]
    {
        new object[] { "null", null },
        new object[] { "[]", new Dictionary<string, string>() },
        new object[]
        {
            @"[
                    { 'Key': 'First', 'Value': '111' },
                    { 'Key': 'Second', 'Value': '222' },
                    { 'Key': 'Third', 'Value': '333' }
                ]",
            new Dictionary<string, string>
            {
                { "First", "111" },
                { "Second", "222" },
                { "Third", "333" },
            },
        },
    };

    public static IEnumerable<object[]> ReadTestCases => TestCases
        .CombineWith(typeof(Dictionary<string, string>), typeof(IDictionary<string, string>), typeof(IReadOnlyDictionary<string, string>));

    [Theory, MemberData(nameof(ReadTestCases))]
    public void Deserialize_ShouldDeserializeFromPairs(string inputJson, Dictionary<string, string> expectedObj, Type typeToDeserialize)
    {
        // Act
        var resultObj = Deserialize(inputJson, typeToDeserialize);

        resultObj.Should().BeEquivalentTo(expectedObj);
    }

    [Fact]
    public void Deserialize_ShouldNotInterfereWithOtherDictionaryTypes()
    {
        // Act
        var resultObj = Deserialize<IDictionary<string, object>>("{ foo: 'bar' }");

        resultObj.Should().BeEquivalentTo(new Dictionary<string, object> { { "foo", "bar" } });
    }

    [Fact]
    public void Deserialize_ShouldThrow_IfUnsupportedDictionaryType()
    {
        var unsupportedType = typeof(SortedDictionary<string, string>);

        Action act = () => Deserialize("[]", unsupportedType);

        act.Should().Throw<JsonException>();
    }

    public class TestModel
    {
        public Dictionary<string, string> ExistingDictionary { get; } = new Dictionary<string, string> { { "First", "111" } };
    }

    [Fact]
    public void Deserialize_ShouldUseExistingValue()
    {
        const string json = @"{
                ""ExistingDictionary"": [
                    { ""Key"": ""Second"", ""Value"": ""222"" },
                    { ""Key"": ""Third"", ""Value"": ""333"" }
                ]
            }";

        // Act
        var model = Deserialize<TestModel>(json);

        model.ExistingDictionary.Should().Equal(
            new Dictionary<string, string>
            {
                { "First", "111" },
                { "Second", "222" },
                { "Third", "333" },
            });
    }

    [Theory, MemberData(nameof(TestCases))]
    public void Serialize_ShouldSerializeToPairs(string expectedJson, Dictionary<string, string> objToSerialize)
    {
        // Act
        var resultJson = Serialize(objToSerialize);

        resultJson.Should().BeJson(expectedJson);
    }

    [Fact]
    public void Serialize_ShouldNotInterfereWithOtherDictionaryTypes()
    {
        // Act
        var resultJson = Serialize(new Dictionary<string, object> { { "foo", "bar" } });

        resultJson.Should().BeJson("{ foo: 'bar' }");
    }
}
