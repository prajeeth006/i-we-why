using System;
using FluentAssertions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Frontend.Vanilla.Core.Tests.Json.Converters;

public abstract class JsonConverterTestsBase
{
    protected abstract JsonConverter Target { get; }

    private readonly JsonSerializerSettings settings;

    protected JsonConverterTestsBase()
        => settings = new JsonSerializerSettings
        {
            Converters = { Target },
            ContractResolver = new CamelCasePropertyNamesContractResolver(), // Should be ignored
        };

    protected T Deserialize<T>(string json)
        where T : notnull
        => (T)Deserialize(json, typeof(T));

    protected object Deserialize(string json, Type type)
        => JsonConvert.DeserializeObject(json, type, settings);

    protected string Serialize(object obj)
        => JsonConvert.SerializeObject(obj, settings);

    protected void RunDeserializeInvalidTypeTest<T>(string inputJson)
    {
        Action act = () => Deserialize<T>("123");

        act.Should().Throw<JsonSerializationException>()
            .Which.InnerException.Should().BeOfType<InvalidCastException>();
    }
}
