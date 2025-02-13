using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Features.ReCaptcha;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ReCaptcha;

public class ReCaptchaHealthCheckTests
{
    private IHealthCheck target;
    private ReCaptchaConfiguration reCaptchaConfiguration;
    private Mock<IVerificationService> verificationService;
    private CancellationToken ct;

    public ReCaptchaHealthCheckTests()
    {
        verificationService = new Mock<IVerificationService>();
        reCaptchaConfiguration = new ReCaptchaConfiguration();
        target = new ReCaptchaEnterpriseHealthCheck(verificationService.Object, reCaptchaConfiguration);

        ct = TestCancellationToken.Get();

        reCaptchaConfiguration.Areas = new Dictionary<string, ReCaptchaEnablement> { ["test"] = ReCaptchaEnablement.Enabled };
        verificationService.Setup(s => s.VerifyEnterpriseRawAsync("test", ct)).ReturnsAsync(new ReCaptchaAssessment());
    }

    [Fact]
    public void ShouldExposeCorrectMetadata()
        => target.Metadata.Should().NotBeNull().And.BeSameAs(target.Metadata, "should be singleton");

    [Fact]
    public async Task ShouldSucceed()
    {
        var result = await target.ExecuteAsync(ct); // Act

        result.Error.Should().BeNull();
    }

    [Fact]
    public async Task ShouldFail_OnEnterpriseException()
    {
        var networkEx = new Exception("Network error");
        verificationService.Setup(s => s.VerifyEnterpriseRawAsync("test", ct)).ThrowsAsync(networkEx);

        var result = await target.ExecuteAsync(ct); // Act

        result.Error.Should().BeSameAs(networkEx);
    }
}
