using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Model.Authentication;

public class LoginResponseTests
{
    [Fact]
    public void ShouldDeserializeCorrectly()
    {
        const string json = @"{
                ""Balance"": {
                    ""accountBalance"": 814.6
                },
                ""LoyaltyStatus"": {
                    ""points"": 523.5
                },
                ""ClaimValues"": [
                    { ""Key"": ""http://api.bwin.com/v3/user/currency"", ""Value"": ""EUR"" },
                    { ""Key"": ""http://api.bwin.com/v3/user/nationality"", ""Value"": ""Borg"" },
                ],
                ""PendingActions"":{
                    ""Actions"": [{ ""name"": ""SHOW_KYC_STATUS""}]
                },
                ""PostLoginValues"": [
                    { ""Key"": ""post-login-1"", ""Value"": ""value-1"" },
                    { ""Key"": ""post-login-2"", ""Value"": ""value-2"" },
                ],
                ""SogeiCustomerId"": null,
                ""accountCategoryId"": 0,
                ""accountId"": 110750845,
                ""globalSessionId"": ""282810131220134AL47TyaOcb"",
                ""language"": ""SW"",
                ""lastLoginUTC"": ""\/Date(1317978268000)\/"",
                ""lastLogoutUTC"": ""\/Date(1317981868490)\/"",
                ""playerCategory"": 1,
                ""realPlayer"": true,
                ""rsaAssigned"": false,
                ""screenName"": ""sntokenguy1"",
                ""serverTimeUTC"": ""/Date(1415267177020)/"",
                ""serviceSessionId"": null,
                ""sessionToken"": ""test-session"",
                ""ssoToken"": ""test-sso"",
                ""userName"": ""chuck-norris"",
                ""userToken"": ""test-user"",
                ""workflowType"": 0,
                ""workflowKeys"": [""workflow-1"", ""workflow-2""],
                ""superCookie"": ""topSecret"",
                ""rememberMeToken"":""swefweqwdqwsdfsdf"",
            }";

        var target = PosApiSerializationTester.Deserialize<LoginResponse>(json); // Act

        target.SessionToken.Should().Be("test-session");
        target.UserToken.Should().Be("test-user");
        target.SsoToken.Should().Be("test-sso");
        target.LastLoginUtc.Should().Be(new UtcDateTime(2011, 10, 07, 09, 04, 28));
        target.LastLogoutUtc.Should().Be(new UtcDateTime(2011, 10, 07, 10, 04, 28, 490));
        target.ClaimValues.Should().Equal(new Dictionary<string, string>
        {
            { "http://api.bwin.com/v3/user/currency", "EUR" },
            { "http://api.bwin.com/v3/user/nationality", "Borg" },
        });
        target.ClaimValues["http://api.bwin.com/v3/user/CURRENCY"].Should().Be("EUR", "should be case-insensitive");
        target.PostLoginValues.Should().Equal(new Dictionary<string, string>
        {
            { "post-login-1", "value-1" },
            { "post-login-2", "value-2" },
        });
        target.WorkflowKeys.Should().Equal("workflow-1", "workflow-2");
        target.SuperCookie.Should().Be("topSecret");
        target.RememberMeToken.Should().Be("swefweqwdqwsdfsdf");

        // For nested objects just test one property b/c they are tested separately
        target.Balance.AccountBalance.Should().Be(814.6m);
        target.LoyaltyStatus.Points.Should().Be(523.5m);
        target.PendingActions.Actions[0].Name.Should().Be("SHOW_KYC_STATUS");
    }
}
