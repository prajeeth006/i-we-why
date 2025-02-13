using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features.ReCaptcha;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ReCaptcha;

public sealed class VerificationMessageProviderTests
{
    private IVerificationMessageProvider target;
    private Mock<IContentService> contentService;
    private TestLogger<VerificationMessageProvider> testLogger;
    private CancellationToken ct;

    public VerificationMessageProviderTests()
    {
        contentService = new Mock<IContentService>();
        testLogger = new TestLogger<VerificationMessageProvider>();
        ct = TestCancellationToken.Get();
        target = new VerificationMessageProvider(contentService.Object, testLogger);
        SetupMessages(null);
    }

    [Fact]
    public async Task GetAsync_ShouldReturnMessage()
    {
        var msg = await target.GetAsync(ct); // Act

        msg.Should().Be("Solve captcha please!");
    }

    [Fact]
    public async Task GetAsync_ShouldLogAndReturnStaticMessage_IfMessageIsNotFound()
    {
        SetupMessages(new Dictionary<string, string>());
        var msg = await target.GetAsync(ct); // Act

        msg.Should().Be("ReCaptcha verification failed.");

        testLogger.Logged[0].Verify(LogLevel.Error, ("content", "App-v1.0/Resources/Messages"));
    }

    [Fact]
    public async Task GetVersionedAsync_ShouldReturnVersionedMessage()
    {
        var msg = await target.GetVersionedAsync(ReCaptchaVersion.Enterprise, ct); // Act

        msg.Should().Be("Enterprise Solve captcha please!");
    }

    [Fact]
    public async Task GetVersionedAsync_ShouldReturnDefaultMessageAndLog_IfVersionedMessageIsNotFound()
    {
        SetupMessages(new Dictionary<string, string>
        {
            ["ReCaptchaVerification"] = "Solve captcha please!",
        });
        var msg = await target.GetVersionedAsync(ReCaptchaVersion.Enterprise, ct); // Act

        msg.Should().Be("Solve captcha please!");

        testLogger.Logged[0].Verify(LogLevel.Error, ("version", ReCaptchaVersion.Enterprise), ("content", "App-v1.0/Resources/Messages"));
    }

    [Fact]
    public async Task GetVersionedAsync_ShouldReturnReturnStaticMessageAndLog_IfVersionedAndDefaultMessageIsNotFound()
    {
        SetupMessages(new Dictionary<string, string>());
        var msg = await target.GetVersionedAsync(ReCaptchaVersion.Enterprise, ct); // Act

        msg.Should().Be("ReCaptcha verification failed.");

        testLogger.Logged[0].Verify(LogLevel.Error, ("version", ReCaptchaVersion.Enterprise), ("content", "App-v1.0/Resources/Messages"));
    }

    private void SetupMessages(Dictionary<string, string> messages)
    {
        messages ??= new Dictionary<string, string>
        {
            ["ReCaptchaVerification"] = "Solve captcha please!",
            ["ReCaptchaVerification.Enterprise"] = "Enterprise Solve captcha please!",
        };

        var item = Mock.Of<IGenericListItem>(i => i.VersionedList == messages.AsContentParameters());
        contentService.Setup(s => s.GetRequiredAsync<IGenericListItem>("App-v1.0/Resources/Messages", ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(item);
    }
}
