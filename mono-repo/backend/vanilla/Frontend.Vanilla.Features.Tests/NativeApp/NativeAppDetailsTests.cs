using System;
using FluentAssertions;
using Frontend.Vanilla.Features.NativeApp;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.NativeApp;

public class NativeAppDetailsTests
{
    [Fact]
    public void Unknown_ShouldBeCompletelyUnknown()
    {
        var target = NativeAppDetails.Unknown;

        target.ApplicationName.Should().Be("unknown");
        target.Product.Should().Be("UNKNOWN");
        target.NativeMode.Should().Be(NativeAppMode.Unknown);
        target.IsNative.Should().BeFalse();
        target.IsNativeApp.Should().BeFalse();
        target.IsNativeWrapper.Should().BeFalse();
        target.IsDownloadClient.Should().BeFalse();
        target.IsDownloadClientApp.Should().BeFalse();
        target.IsDownloadClientWrapper.Should().BeFalse();
        target.IsTerminal.Should().BeFalse();
    }

    [Theory]
    [InlineData(NativeAppMode.Unknown, false, false, false, false, false, false, false)]
    [InlineData(NativeAppMode.Native, true, true, false, false, false, false, false)]
    [InlineData(NativeAppMode.Wrapper, true, false, true, false, false, false, false)]
    [InlineData(NativeAppMode.DownloadClient, true, false, false, true, true, false, false)]
    [InlineData(NativeAppMode.DownloadClientWrapper, true, false, false, true, false, true, false)]
    [InlineData(NativeAppMode.Terminal, true, false, false, false, false, false, true)]
    public void ShouldBeInitializedCorrectly(
        NativeAppMode mode,
        bool expectedIsNative,
        bool expectedIsNativeApp,
        bool expectedIsNativeWrapper,
        bool expectedDownloadClient,
        bool expectedDownloadClientApp,
        bool expectedDownloadClientWrapper,
        bool expectedTerminal)
    {
        var target = new NativeAppDetails("SportsBetting", "Sports", mode.ToString());

        target.ApplicationName.Should().Be("sportsbetting");
        target.Product.Should().Be("SPORTS");
        target.NativeMode.Should().Be(mode);
        target.IsNative.Should().Be(expectedIsNative);
        target.IsNativeApp.Should().Be(expectedIsNativeApp);
        target.IsNativeWrapper.Should().Be(expectedIsNativeWrapper);
        target.IsDownloadClient.Should().Be(expectedDownloadClient);
        target.IsDownloadClientApp.Should().Be(expectedDownloadClientApp);
        target.IsDownloadClientWrapper.Should().Be(expectedDownloadClientWrapper);
        target.IsTerminal.Should().Be(expectedTerminal);
    }

    [Theory]
    [InlineData("Native", NativeAppMode.Native)]
    [InlineData("WRAPPER", NativeAppMode.Wrapper)]
    [InlineData("DownloadClient", NativeAppMode.DownloadClient)]
    public void ShouldParseNativeMode(string input, NativeAppMode expected)
    {
        var target = new NativeAppDetails("SportsBetting", "Sports", input);
        target.NativeMode.Should().Be(expected);
    }

    [Theory, ValuesData(null, "", "  ", "WTF?")]
    public void ShouldThrow_IfInvalidMode(string nativeMode)
        => new Action(() => new NativeAppDetails("SportsBetting", "Sports", nativeMode)).Should().Throw<ArgumentException>();
}
