using FluentAssertions;
using Frontend.Vanilla.Core.Rest.Formatters;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Testing.FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Rest.Formatters;

public sealed class NewtonsoftJsonFormatterTests
{
    private IRestFormatter target;

    public NewtonsoftJsonFormatterTests()
        => target = NewtonsoftJsonFormatter.Default;

    [Fact]
    public void ContentTypeTest()
        => target.ContentType.Should().Be(ContentTypes.Json);

    [Fact]
    public void Serialize_ShouldSerializeObject()
    {
        var obj = new Person { Name = "Chuck Norris", Level = 666 };

        // Act
        var bytes = target.Serialize(obj);

        bytes.DecodeToString().Should().BeJson("{ Name: 'Chuck Norris', Level: 666 }");
    }

    [Fact]
    public void Deserialize_ShouldDeserializeObject()
    {
        var bytes = "{ Name: 'Chuck Norris', Level: 666 }".EncodeToBytes();

        // Act
        var obj = (Person)target.Deserialize(bytes, typeof(Person));

        obj.Name.Should().Be("Chuck Norris");
        obj.Level.Should().Be(666);
    }

    [Fact]
    public void Constructor_ShouldApplySettings()
    {
        target = new NewtonsoftJsonFormatter(new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });

        // Act
        var bytes = target.Serialize(new { TestedValue = 123 });

        bytes.DecodeToString().Should().BeJson("{ testedValue: 123 }");
    }

    public class Person
    {
        public string Name { get; set; }
        public int Level { get; set; }
    }
}
