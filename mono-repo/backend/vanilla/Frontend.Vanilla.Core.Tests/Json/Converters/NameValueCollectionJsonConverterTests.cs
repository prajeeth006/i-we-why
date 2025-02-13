using System.Collections.Specialized;
using FluentAssertions;
using Frontend.Vanilla.Core.Json.Converters;
using Frontend.Vanilla.Testing.FluentAssertions;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Json.Converters;

public class NameValueCollectionJsonConverterTests : JsonConverterTestsBase
{
    protected override JsonConverter Target => new NameValueCollectionJsonConverter();

    [Fact]
    public void Serialize_ShouldWriteJsonObject()
    {
        var collection = new NameValueCollection
        {
            { "key_one", "value_one_a" },
            { "key_two", "value_two_a" },
            { "key_one", "value_one_b" },
        };

        // Act
        var json = Serialize(collection);

        json.Should().BeJson(@"{
                key_one: 'value_one_a,value_one_b',
                key_two: 'value_two_a'
            }");
    }
}
