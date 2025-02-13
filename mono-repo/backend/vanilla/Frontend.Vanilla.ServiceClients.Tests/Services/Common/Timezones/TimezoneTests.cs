using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Common.Timezones;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.Timezones;

public sealed class TimezoneTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        const string json = @"{""Timezones"": [
            {
                ""id"": ""Dateline Standard Time"",
                ""minutesToGMT"": -720,
                ""name"": ""GMT-12 (Eniwetok, Kwajalein)""
            },
            {
                ""id"": ""Samoa Standard Time"",
                ""minutesToGMT"": -660,
                ""name"": ""GMT-11 (Midway-Inseln, Samoa)""
            },
            {
                ""id"": ""Hawaiian Standard Time"",
                ""minutesToGMT"": -600,
                ""name"": ""GMT-10 (Hawaii)""
            }
        ]}";

        // Act
        var target = PosApiSerializationTester.Deserialize<TimezoneResponse>(json).GetData();

        target.Should().MatchItems(
            z => z.Id == "Dateline Standard Time" && z.MinutesToGMT == -720 && z.Name == "GMT-12 (Eniwetok, Kwajalein)",
            z => z.Id == "Samoa Standard Time" && z.MinutesToGMT == -660 && z.Name == "GMT-11 (Midway-Inseln, Samoa)",
            z => z.Id == "Hawaiian Standard Time" && z.MinutesToGMT == -600 && z.Name == "GMT-10 (Hawaii)");
    }
}
