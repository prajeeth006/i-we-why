using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Core.Time.Background;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Time.Background;

public class CultureBackgroundWorkInitializerTests
{
    private IBackgroundWorkInitializer target;

    public CultureBackgroundWorkInitializerTests()
        => target = new CultureBackgroundWorkInitializer();

    [Fact]
    public void ShouldPassCulture()
    {
        CultureInfo.CurrentCulture = CultureInfo.CurrentUICulture = new CultureInfo("sw-KE");

        // Act 1
        var func = target.CaptureParentContext();

        VerifyCulture("sw-KE");
        CultureInfo.CurrentCulture = CultureInfo.CurrentUICulture = new CultureInfo("zh-CN"); // Simulates switch to other thread

        // Act 2
        func();

        VerifyCulture("sw-KE");
    }

    private void VerifyCulture(string expected)
    {
        CultureInfo.CurrentCulture.Name.Should().Be(expected);
        CultureInfo.CurrentUICulture.Name.Should().Be(expected);
    }
}
