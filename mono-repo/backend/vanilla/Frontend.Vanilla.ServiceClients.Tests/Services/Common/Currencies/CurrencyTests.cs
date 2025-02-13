using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.ServiceClients.Services.Common.Currencies;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.Currencies;

public sealed class CurrencyTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        const string json = @"{ ""Currencies"": [
                { ""id"": ""EUR"", ""name"": ""Euro"" },
                { ""id"": ""USD"", ""name"": ""United States dollar"" }
            ]}";

        var target = PosApiSerializationTester.Deserialize<CurrenciesResponse>(json).GetData(); // Act

        target.Should().MatchItems(
            c => c.Id == "EUR" && c.Name == "Euro",
            c => c.Id == "USD" && c.Name == "United States dollar");
    }

    [Fact]
    public void ShouldFormatMoneyAccordingToCurrencyAndCulture()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("de-DE"));
        var target = new Currency(id: "EUR", name: "Euro");
        target.FormatMoney(12000M).Should().Be("12.000,00 EUR"); // Act
    }
}
