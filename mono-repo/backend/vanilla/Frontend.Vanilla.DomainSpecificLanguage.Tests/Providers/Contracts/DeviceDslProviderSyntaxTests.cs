using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class DeviceDslProviderSyntaxTests : SyntaxTestBase<IDeviceDslProvider>
{
    [Theory, BooleanData]
    public void IsMobileTest(bool value)
    {
        Provider.Setup(p => p.IsMobileAsync(Mode)).ReturnsAsync(value);
        EvaluateAndExpect("Device.IsMobile", value);
    }

    [Theory, BooleanData]
    public void IsTouchTest(bool value)
    {
        Provider.Setup(p => p.IsTouchAsync(Mode)).ReturnsAsync(value);
        EvaluateAndExpect("Device.IsTouch", value);
    }

    [Theory, BooleanData]
    public void IsRobotTest(bool value)
    {
        Provider.Setup(p => p.IsRobotAsync(Mode)).ReturnsAsync(value);
        EvaluateAndExpect("Device.IsRobot", value);
    }

    [Theory, BooleanData]
    public void IsMobilePhoneTest(bool value)
    {
        Provider.Setup(p => p.IsTabletAsync(Mode)).ReturnsAsync(value);
        EvaluateAndExpect("Device.IsTablet", value);
    }

    [Theory, BooleanData]
    public void IsTabletTest(bool value)
    {
        Provider.Setup(p => p.IsMobilePhoneAsync(Mode)).ReturnsAsync(value);
        EvaluateAndExpect("Device.IsMobilePhone", value);
    }

    [Theory, BooleanData]
    public void IsIOSTest(bool value)
    {
        Provider.Setup(p => p.IsIOSAsync(Mode)).ReturnsAsync(value);
        EvaluateAndExpect("Device.IsIOS", value);
    }

    [Theory, BooleanData]
    public void IsAndroidTest(bool value)
    {
        Provider.Setup(p => p.IsAndroidAsync(Mode)).ReturnsAsync(value);
        EvaluateAndExpect("Device.IsAndroid", value);
    }

    [Fact]
    public void OSNameTest()
    {
        Provider.Setup(p => p.OSNameAsync(Mode)).ReturnsAsync("Skynet");
        EvaluateAndExpect("Device.OSName", "Skynet");
    }

    [Fact]
    public void OSVersionTest()
    {
        Provider.Setup(p => p.OSVersionAsync(Mode)).ReturnsAsync("6.6.6");
        EvaluateAndExpect("Device.OSVersion", "6.6.6");
    }

    [Fact]
    public void ModelTest()
    {
        Provider.Setup(p => p.ModelAsync(Mode)).ReturnsAsync("Nexus 666");
        EvaluateAndExpect("Device.Model", "Nexus 666");
    }

    [Fact]
    public void VendorTest()
    {
        Provider.Setup(p => p.VendorAsync(Mode)).ReturnsAsync("Google");
        EvaluateAndExpect("Device.Vendor", "Google");
    }

    [Fact]
    public void GetCapabilityTest()
    {
        Provider.Setup(p => p.GetCapabilityAsync(Mode, "Drive")).ReturnsAsync("Warp");
        EvaluateAndExpect("Device.GetCapability('Drive')", "Warp");
    }
}
