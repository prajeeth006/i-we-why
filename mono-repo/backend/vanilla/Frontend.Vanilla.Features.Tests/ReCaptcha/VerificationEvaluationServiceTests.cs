using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.ReCaptcha;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ReCaptcha;

public sealed class VerificationEvaluationServiceTests
{
    private IVerificationEvaluationService target;
    private Mock<IVerificationService> verificationService;
    private CancellationToken ct;
    private ReCaptchaVerificationResult verificationResult;

    public VerificationEvaluationServiceTests()
    {
        verificationService = new Mock<IVerificationService>();
        ct = TestCancellationToken.Get();

        target = new VerificationEvaluationService(verificationService.Object);

        verificationService.Setup(v => v.VerifyAsync("Area", "resp", new Dictionary<string, object>(), ct)).ReturnsAsync(() => verificationResult);
    }

    [Fact]
    public async Task VerifyUsersResponseAsync_ShouldReturnSuccess()
    {
        verificationResult = new ReCaptchaVerificationResult(true, new List<string>());

        var passed = await target.VerifyUsersResponseAsync("Area", "resp", new Dictionary<string, object>(), ct);

        passed.Should().BeTrue();
    }

    [Fact]
    public async Task VerifyUsersResponseAsync_ShouldReturnSuccess_WhenDisabled()
    {
        verificationResult = new ReCaptchaVerificationResult(false, new List<string> { ReCaptchaErrorCodes.Disabled });

        var passed = await target.VerifyUsersResponseAsync("Area", "resp", new Dictionary<string, object>(), ct);

        passed.Should().BeTrue();
    }

    [Fact]
    public async Task VerifyUsersResponseAsync_ShouldReturnFailure()
    {
        verificationResult = new ReCaptchaVerificationResult(false, new List<string> { ReCaptchaErrorCodes.InvalidInputResponse });

        var passed = await target.VerifyUsersResponseAsync("Area", "resp", new Dictionary<string, object>(), ct);

        passed.Should().BeFalse();
    }
}
