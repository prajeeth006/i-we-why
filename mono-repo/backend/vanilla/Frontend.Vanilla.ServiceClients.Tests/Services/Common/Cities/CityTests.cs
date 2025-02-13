using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Common.Cities;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.Cities;

public sealed class CityTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        const string json = @"{ ""Cities"": [
                { ""name"": ""Austria"", ""code"": ""AT"", ""id"": ""AUSTRIA"" },
                { ""name"": ""Italy"", ""code"": ""IT"", ""id"": ""ITALY"" },
                { ""name"": ""India"", ""code"": ""IN"", ""id"": ""INDIA"" },
                { ""name"": ""Sweden"", ""code"": ""SW"", ""id"": ""SWEDEN"" },
            ]}";

        // Act
        var target = PosApiSerializationTester.Deserialize<CitiesResponse>(json).GetData();

        target.Should().BeEquivalentOrderedTo(
            new City(id: "AUSTRIA", code: "AT", name: "Austria"),
            new City(id: "ITALY", code: "IT", name: "Italy"),
            new City(id: "INDIA", code: "IN", name: "India"),
            new City(id: "SWEDEN", code: "SW", name: "Sweden"));
    }
}
