using System;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Model.Authentication;

public class DeviceFingerprintTests
{
    private DeviceFingerprint target;

    public DeviceFingerprintTests()
        => target = new DeviceFingerprint();

    [Fact]
    public void Constructor_ShouldInitializeCorrectly()
    {
        target.SuperCookie.Should().BeNull();
        target.DeviceDetails.Should().BeEmpty();
    }

    [Fact]
    public void Language_ShouldThrow_IfNull()
        => target.Invoking(t => t.DeviceDetails = null).Should().Throw<ArgumentException>();

    [Fact]
    public void ShouldSerializeCorrectly()
    {
        target.SuperCookie = "Chocolate Chip";
        target.DeviceDetails["level"] = "666";
        target.DeviceDetails["battery"] = "102%";

        // Act
        var json = PosApiSerializationTester.Serialize(target);

        json.Should().BeJson(
            @"{
                superCookie: 'Chocolate Chip',
                deviceDetails: [
                    { Key: 'level', Value: '666' },
                    { Key: 'battery', Value: '102%' }
                ]
            }");
    }
}
