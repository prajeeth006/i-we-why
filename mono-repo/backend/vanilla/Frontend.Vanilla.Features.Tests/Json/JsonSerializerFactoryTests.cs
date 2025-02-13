using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Features.Json;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Json;

public class JsonSerializerFactoryTests
{
    private IJsonSerializerFactory jsonSerializerFactory;
    private List<IJsonSerializerSettingsConfigurator> jsonSerializerSettingsConfigurators;

    private Mock<IJsonSerializerSettingsConfigurator> configurator1;
    private Mock<IJsonSerializerSettingsConfigurator> configurator2;

    private class MockConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            throw new NotImplementedException();
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }
    }

    public JsonSerializerFactoryTests()
    {
        configurator1 = new Mock<IJsonSerializerSettingsConfigurator>();
        configurator2 = new Mock<IJsonSerializerSettingsConfigurator>();

        jsonSerializerSettingsConfigurators = new List<IJsonSerializerSettingsConfigurator>
        {
            configurator1.Object,
            configurator2.Object,
        };

        configurator1.Setup(c => c.Configure(It.IsAny<JsonSerializerSettings>()))
            .Callback<JsonSerializerSettings>(s => { s.NullValueHandling = NullValueHandling.Ignore; });

        configurator2.Setup(c => c.Configure(It.IsAny<JsonSerializerSettings>())).Callback<JsonSerializerSettings>(s => { s.Converters.Add(new MockConverter()); });

        jsonSerializerFactory = new JsonSerializerFactory(jsonSerializerSettingsConfigurators);
    }

    [Fact]
    public void CreateSerializer_ShouldCreateSerializerWithOptionsSetByConfigurators()
    {
        var serializer = jsonSerializerFactory.CreateSerializer();

        serializer.NullValueHandling.Should().Be(NullValueHandling.Ignore);
        serializer.Converters.Count(c => c.GetType() == typeof(MockConverter)).Should().Be(1);
    }
}
