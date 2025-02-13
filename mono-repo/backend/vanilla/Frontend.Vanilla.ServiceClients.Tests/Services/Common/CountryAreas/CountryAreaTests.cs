using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Common.CountryAreas;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.CountryAreas;

public sealed class CountryAreaTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        const string json = @"{ ""CountryAreas"": [
                { ""countryId"": ""FF"", ""name"": ""FooArea"", ""id"": ""Foo"" },
                { ""countryId"": ""BB"", ""name"": ""BarArea"", ""id"": ""Bar"", ""fiscalResidence"":""Vienna"" }
            ]}";

        // Act
        var target = PosApiSerializationTester.Deserialize<CountryAreaResponse>(json).GetData();

        target.Should().BeEquivalentOrderedTo(
            new CountryArea(id: "Foo", name: "FooArea", countryId: "FF"),
            new CountryArea(id: "Bar", name: "BarArea", countryId: "BB", fiscalResidence: "Vienna"));
    }
}
