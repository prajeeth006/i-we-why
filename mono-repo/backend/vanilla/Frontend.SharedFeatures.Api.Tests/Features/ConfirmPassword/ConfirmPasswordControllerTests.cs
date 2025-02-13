using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.ConfirmPassword;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Account.Password;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.ConfirmPassword;

public class ConfirmPasswordControllerTests
{
    private readonly ConfirmPasswordController target;
    private readonly Mock<IPasswordServiceClient> passwordServiceClient;
    private readonly TestLogger<ConfirmPasswordController> log;
    private readonly CancellationToken ct;

    public ConfirmPasswordControllerTests()
    {
        passwordServiceClient = new Mock<IPasswordServiceClient>();
        log = new TestLogger<ConfirmPasswordController>();
        target = new ConfirmPasswordController(passwordServiceClient.Object, log);
        ct = TestCancellationToken.Get();
    }

    [Fact]
    public async Task ShouldReturnIfPasswordIsRequired()
    {
        passwordServiceClient.Setup(c => c.GetAsync(ExecutionMode.Async(ct))).ReturnsAsync(new PasswordValidation(true));

        var result = (OkObjectResult)await target.IsPasswordValidationRequired(ct); // Act

        ((bool?)((dynamic?)result.Value)?.ValidationRequired).Should().Be(true);

        passwordServiceClient.Verify(s => s.GetAsync(ExecutionMode.Async(ct)));
    }

    [Fact]
    public async Task ShouldReturnServerError_IfPosApiException()
    {
        var ex = new PosApiException(posApiCode: 100);
        passwordServiceClient.Setup(c => c.GetAsync(ExecutionMode.Async(ct))).ThrowsAsync(ex);

        var result = (BadRequestObjectResult)await target.IsPasswordValidationRequired(ct); // Act

        result.Should().NotBeNull();
        result.Value.Should().BeEquivalentTo(new { errorCode = 100 });
        log.Logged.Single().Verify(LogLevel.Error, ex);
    }

    [Fact]
    public async Task ShouldReturnServerError_IfException()
    {
        var ex = new Exception();
        passwordServiceClient.Setup(c => c.GetAsync(ExecutionMode.Async(ct))).ThrowsAsync(ex);

        var result = await target.IsPasswordValidationRequired(ct); // Act

        result.Should().BeOfType<BadRequestObjectResult>();
        log.Logged.Single().Verify(LogLevel.Error, ex);
    }
}
