using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.ReCaptcha;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.ReCaptcha;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.Recaptcha;

public sealed class ReCaptchaControllerTests
{
    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task ShouldEvaluateEnablement(bool isEnabled)
    {
        var service = new Mock<IReCaptchaService>();
        var target = new ReCaptchaController(service.Object);
        var ct = TestCancellationToken.Get();

        service.SetupWithAnyArgs(s => s.IsEnabledAsync(It.IsAny<TrimmedRequiredString>(), TestContext.Current.CancellationToken)).ReturnsAsync(isEnabled);

        dynamic result = await target.GetEnabled("Login", ct); // Act

        ((bool)result.Value.enabled).Should().Be(isEnabled);
        service.Verify(s => s.IsEnabledAsync("Login", ct));
    }
}
