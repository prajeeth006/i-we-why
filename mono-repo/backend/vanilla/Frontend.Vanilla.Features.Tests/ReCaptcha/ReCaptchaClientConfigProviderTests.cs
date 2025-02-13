using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.ReCaptcha;
using Frontend.Vanilla.Testing.AbstractTests;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ReCaptcha;

public class ReCaptchaClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private Mock<IReCaptchaService> reCaptchaService;
    private TestLogger<ReCaptchaClientConfigProvider> log;

    public ReCaptchaClientConfigProviderTests()
    {
        var reCaptchaConfig = new ReCaptchaConfiguration
        {
            InstrumentationOnPageLoad = true,
            Theme = "black",
            EnterpriseSiteKey = "enterprise site key",
            EnterpriseSecretKey = "enterprise secret key",
            EnterpriseProjectId = "project-id",
        };
        reCaptchaService = new Mock<IReCaptchaService>();
        log = new TestLogger<ReCaptchaClientConfigProvider>();
        Target = new ReCaptchaClientConfigProvider(reCaptchaConfig, reCaptchaService.Object, log);
    }

    [Fact]
    public async Task ShouldReturnCaptchaConfig()
    {
        reCaptchaService.Setup(r => r.GetVerificationMessageAsync(Ct)).ReturnsAsync("msg");

        var config = await Target_GetConfigAsync(); // Act

        config.Should().BeEquivalentTo(new Dictionary<string, object>
        {
            { "enterpriseSiteKey", "enterprise site key" },
            { "instrumentationOnPageLoad", true },
            { "theme", "black" },
            { "verificationMessage", (RequiredString)"msg" },
        });
    }

    [Fact]
    public async Task ShouldHandleExceptions()
    {
        var msgEx = new Exception("Message error");
        reCaptchaService.Setup(r => r.GetVerificationMessageAsync(Ct)).ThrowsAsync(msgEx);

        var config = await Target_GetConfigAsync(); // Act

        config.Should().Contain("verificationMessage", null);
        log.Logged.Single().Verify(LogLevel.Error, msgEx);
    }
}
