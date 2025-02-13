using System;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Common.Countries;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.ServiceClients;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.Countries;

public sealed class CountryTests
{
    [Theory, BooleanData]
    public void CanBeDeserialized(bool onlyZipFormatPattern)
    {
        var json = @"{
                ""Countries"": [
                    {
                        ""id"":""AT"",
                        ""threeLetterCode"":""AUT"",
                        ""name"":""Austria"",
                        ""defaultTimezone"":""Central Europe Standard Time"",
                        ""defaultCurrency"":""EUR"",
                        ""predial"":""+43"","
                   + (onlyZipFormatPattern
                       ? @"""zipFormat"":""DDDdd"""
                       : @"""zipFormatValidation"": {
                            ""minLength"": 3,
                            ""maxLength"": 5,
                            ""regex"": ""\\d\\d\\d\\d?\\d?""
                        }") + @"
                    }
                ]
            }";

        // Act
        var target = PosApiSerializationTester.Deserialize<CountriesResponse>(json).GetData();

        target.Should().MatchItems(
            c => c.Id == "AT" && c.ThreeLetterCode == "AUT" && c.Name == "Austria" && c.DefaultTimezone == "Central Europe Standard Time" && c.DefaultCurrency == "EUR"
                 && c.Predial == "+43" && c.ZipFormat.MinLength == 3 && c.ZipFormat.MaxLength == 5 && c.ZipFormat.Regex.ToString().Contains("\\d\\d\\d\\d?\\d?"));
    }

    [Fact]
    public void ShouldFailDeserialization_IfInvalidZipFormat()
    {
        var target = PosApiSerializationTester.Deserialize<CountriesResponse>(
            @"{
                ""Countries"": [{
                    ""id"":""AT"",
                    ""threeLetterCode"":""AUT"",
                    ""name"":""Austria"",
                    ""defaultTimezone"":""Central Europe Standard Time"",
                    ""defaultCurrency"":""EUR"",
                    ""predial"":""+43"",
                    ""zipFormat"":""bullshit""
            }]}");

        target.Invoking(t => t.GetData())
            .Should().Throw<InvalidOperationException>();
    }
}
