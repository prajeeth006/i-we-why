using System;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Common.HistoricalCountries;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.HistoricalCountries;

public sealed class HistoricalCountryTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        const string json = @"{""HistoricalCountries"":[
                { ""id"": ""AUSTRIA"", ""name"": ""Austria"", ""code"": ""Z102"", ""created"": ""/Date(-62135596800000)/"", ""disbanded"": ""/Date(654908400000)/"" },
                { ""id"": ""FRANCIA"", ""name"": ""Francia"", ""code"": ""Z110"", ""created"": ""/Date(189216000000)/"", ""disbanded"": ""/Date(253402214400000)/"" },
                { ""id"": ""MALTA"", ""name"": ""Malta"", ""code"": ""Z121"", ""created"": ""/Date(-62135596800000)/"", ""disbanded"": ""/Date(253402214400000)/"" },
            ]}";

        // Act
        var countries = PosApiSerializationTester.Deserialize<HistoricalCountryResponse>(json).GetData();

        countries.Should().MatchItems(
            c => c.Id == "AUSTRIA" && c.Name == "Austria" && c.Code == "Z102" && c.Disbanded.Value == new DateTime(1970, 1, 1).AddMilliseconds(654908400000),
            c => c.Id == "FRANCIA" && c.Name == "Francia" && c.Code == "Z110" && c.Created.Value == new DateTime(1970, 1, 1).AddMilliseconds(189216000000),
            c => c.Id == "MALTA" && c.Name == "Malta" && c.Code == "Z121");
    }
}
