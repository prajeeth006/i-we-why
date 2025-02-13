using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.ServiceClients;

namespace Frontend.Vanilla.ServiceClients.Tests.Model.Authentication;

public class CommonParametersTests
{
    public CommonParametersTests()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("zh-CN"));
    }

    internal void ShouldHaveCorrectCommonProperties(CommonLoginParameters target)
    {
        target.Language.Should().Be(new CultureInfo("zh-CN"));
        target.ChannelId.Should().BeNull();
        target.ProductId.Should().BeNull();
        target.Ucid.Should().BeNull();
        target.Fingerprint.Should().BeNull();
    }

    protected const string CommonJsonProperties = @"
            language: 'zh-CN',
            deviceId: 'DEV123',
            ucid: 'UC123',
            fingerprint: { superCookie: 'Chocolate Chip', deviceDetails: [] }";

    internal void RunSerializationTest(CommonLoginParameters target, string expectedJson)
    {
        target.DeviceId = "DEV123";
        target.Ucid = "UC123";
        target.Fingerprint = new DeviceFingerprint { SuperCookie = "Chocolate Chip" }; // Just test it gets serialized, fully tested separately

        // Should be ignored b/c passed via headers
        target.ChannelId = "mobile";
        target.ProductId = "sports";
        target.BrandId = "BWIN";

        var json = PosApiSerializationTester.Serialize(target); // Act

        json.Should().BeJson(expectedJson);
    }
}
