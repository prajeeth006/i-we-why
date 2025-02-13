using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.ReCaptcha;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ReCaptcha;

public sealed class EnablementServiceTests
{
    private IEnablementService target;
    private ReCaptchaConfiguration config;
    private Mock<IFailureCounter> counter;
    private TestLogger<EnablementService> log;
    private CancellationToken ct;

    public EnablementServiceTests()
    {
        config = new ReCaptchaConfiguration();
        counter = new Mock<IFailureCounter>();
        log = new TestLogger<EnablementService>();
        ct = TestCancellationToken.Get();
        target = new EnablementService(config, counter.Object, log);

        config.Areas = new Dictionary<string, ReCaptchaEnablement>
        {
            ["Registration"] = ReCaptchaEnablement.Enabled,
            ["Login"] = ReCaptchaEnablement.EnableOnFailureCount,
            ["Contact"] = ReCaptchaEnablement.Disabled,
        };
    }

    [Theory]
    [InlineData("Registration", true)]
    [InlineData("Contact", false)]
    public async Task ShouldDirectlyReturnEnabledOrDisabled(string area, bool expected)
    {
        var result = await target.IsEnabledAsync(area, ct); // Act

        result.Should().Be(expected);
        counter.VerifyWithAnyArgs(c => c.HasFailedAsync(default, TestContext.Current.CancellationToken), Times.Never);
        log.VerifyNothingLogged();
    }

    [Theory, BooleanData]
    public async Task ShouldDelegateToCounter_IfConfigured(bool enabled)
    {
        counter.Setup(c => c.HasFailedAsync("Login", ct)).ReturnsAsync(enabled);

        var result = await target.IsEnabledAsync("Login", ct); // Act

        result.Should().Be(enabled);
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldReturnFalseAndLogIfInvalidArea()
    {
        var result = await target.IsEnabledAsync("Foo", ct); // Act

        result.Should().BeTrue();
        log.Logged.Single().Verify(LogLevel.Error, ("area", (TrimmedRequiredString)"Foo"));
    }
}
