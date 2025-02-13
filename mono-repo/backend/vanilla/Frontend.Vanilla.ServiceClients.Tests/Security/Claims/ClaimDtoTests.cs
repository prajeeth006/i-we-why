using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security.Claims;
using Frontend.Vanilla.Testing.FluentAssertions;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Security.Claims;

public class ClaimDtoTests
{
    private const string Json = @"[
                                {Type: 'http://api.bwin.com/v3/user/sessiontoken', Value: '5844g', ValueType: 'String', Issuer: 'issuerMock', OriginalIssuer: 'oriIssuerMock'},
                                {Type: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name', Value: 'Chuck Norris', ValueType: 'String', Issuer: 'Bwin', OriginalIssuer: 'oriBwin'},
                                {Type: 'http://api.bwin.com/v3/user/usertoken', Value: 'ert56', ValueType: 'String', Issuer: 'GVC', OriginalIssuer: 'oriGVC'},
                                ]";

    [Fact]
    public void CanBeSerialized()
    {
        var claims = new List<ClaimsCache.ClaimDto>()
        {
            new ClaimsCache.ClaimDto(PosApiClaimTypes.SessionToken, "5844g", "String", "issuerMock", "oriIssuerMock"),
            new ClaimsCache.ClaimDto(PosApiClaimTypes.Name, "Chuck Norris", "String", "Bwin", "oriBwin"),
            new ClaimsCache.ClaimDto(PosApiClaimTypes.UserToken, "ert56", "String", "GVC", "oriGVC"),
        };

        // Act
        var result = JsonConvert.SerializeObject(claims);

        result.Should().BeJson(Json);
    }

    [Fact]
    public void CanBeDeserialized()
    {
        // Act
        var result = JsonConvert.DeserializeObject<IReadOnlyList<ClaimsCache.ClaimDto>>(Json);

        result.Should().MatchItems(
            c => c.Type == "http://api.bwin.com/v3/user/sessiontoken" && c.Value == "5844g" && c.ValueType == "String" && c.Issuer == "issuerMock" &&
                 c.OriginalIssuer == "oriIssuerMock",
            c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name" && c.Value == "Chuck Norris" && c.ValueType == "String" && c.Issuer == "Bwin" &&
                 c.OriginalIssuer == "oriBwin",
            c => c.Type == "http://api.bwin.com/v3/user/usertoken" && c.Value == "ert56" && c.ValueType == "String" && c.Issuer == "GVC" && c.OriginalIssuer == "oriGVC");
    }
}
