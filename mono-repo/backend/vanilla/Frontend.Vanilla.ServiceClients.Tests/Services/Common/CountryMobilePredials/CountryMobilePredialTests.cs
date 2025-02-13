using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Common.CountryMobilePredials;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.CountryMobilePredials;

public sealed class CountryMobilePredialTests
{
    [Fact]
    public void GetMobileOperators_ShouldReturnAll()
    {
        const string json = @"{""Countries"":[
                {""CountryPredial"":""+43"",""Operators"":[{""code"":""650""},{""code"":""660""}]},
                {""CountryPredial"":""+1"",""Operators"":[{""code"":""007""}]},
                {""CountryPredial"":""+2"",""Operators"":[]}
            ]}";

        // Act
        var target = PosApiSerializationTester.Deserialize<CountryMobilePredialsResponse>(json).GetData();

        target.Should().MatchItems(
            p => p.CountryPredial == "+43" && p.OperatorCodes != null && p.OperatorCodes.Count == 2 && p.OperatorCodes[0] == "650" && p.OperatorCodes[1] == "660",
            p => p.CountryPredial == "+1" && p.OperatorCodes != null && p.OperatorCodes.Count == 1 && p.OperatorCodes[0] == "007",
            p => p.CountryPredial == "+2" && p.OperatorCodes != null && p.OperatorCodes.Count == 0);
    }
}
