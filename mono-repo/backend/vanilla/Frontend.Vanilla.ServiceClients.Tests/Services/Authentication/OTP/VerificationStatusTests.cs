using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Authentication.OTP;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Authentication.OTP;

public class VerificationStatusTests
{
    [Fact]
    public void ShouldDeserialize()
    {
        var json = @"{
                ""status"": [
                    {
                        ""Key"": ""Email"",
                        ""Value"": ""verified""
                    },
                    {
                        ""Key"": ""Mobile"",
                        ""Value"": ""pending""
                    }
                ]
            }";

        var verificationStatus = PosApiSerializationTester.Deserialize<VerificationStatusResponse>(json).GetData();

        verificationStatus.Should().BeEquivalentTo(new Dictionary<string, string> { ["Email"] = "verified", ["Mobile"] = "pending" });
    }
}
