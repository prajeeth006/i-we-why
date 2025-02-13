using System.Security.Claims;
using Frontend.Host.Features.EmailVerification;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.Testing.Fakes;

namespace Frontend.Host.Tests.Features.EmailVerification;

public class EmailVerificationMiddlewareTests
{
    private readonly EmailVerificationMiddleware target;
    private readonly Mock<IPosApiAccountServiceInternal> mockAccountService;
    private readonly Mock<IEmailVerificationConfiguration> emailVerificationConfiguration;
    private readonly Mock<ILanguageService> languageService;
    private readonly TestLogger<EmailVerificationMiddleware> logger;
    private readonly DefaultHttpContext httpContext;
    private readonly ExecutionMode executionMode;
    private readonly string emailKey = "test";

    public EmailVerificationMiddlewareTests()
    {
        mockAccountService = new Mock<IPosApiAccountServiceInternal>();
        emailVerificationConfiguration = new Mock<IEmailVerificationConfiguration>();
        languageService = new Mock<ILanguageService>();
        logger = new TestLogger<EmailVerificationMiddleware>();

        httpContext = new DefaultHttpContext();
        executionMode = ExecutionMode.Async(httpContext.RequestAborted);

        target = new EmailVerificationMiddleware(
            next: _ => Task.CompletedTask,
            log: logger,
            accountService: mockAccountService.Object,
            emailVerificationConfiguration: emailVerificationConfiguration.Object,
            languageResolver: languageService.Object);

        httpContext.Request.QueryString = new QueryString($"?emailKey={emailKey}");
        httpContext.User = new ClaimsPrincipal(new ClaimsIdentity([
            new Claim(PosApiClaimTypes.JurisdictionId, "ROW")
        ], "mock"));
        languageService.SetupGet(l => l.Current).Returns(TestLanguageInfo.Get(routeValue: "en"));
        emailVerificationConfiguration.SetupGet(c => c.RedirectUrl).Returns("/{culture}/mobileportal/verifyemail?code={code}");
    }

    [Theory]
    [InlineData("ROW", "200")]
    [InlineData("MGA", "201")]
    public async Task InvokeAsync_ShouldRedirectToSuccessUrl_WhenCodeIsValid(string jurisdiction, string expectedCode)
    {
        // Arrange
        httpContext.User = new ClaimsPrincipal(new ClaimsIdentity([
            new Claim(PosApiClaimTypes.JurisdictionId, jurisdiction)
        ], "mock"));

        // Act
        await target.InvokeAsync(httpContext);

        // Assert
        httpContext.Response.Headers.Location.ToString().Should().Be($"/en/mobileportal/verifyemail?code={expectedCode}");
        mockAccountService.Verify(a => a.ValidateEmailVerificationCodeAsync(executionMode, emailKey));
    }

    [Theory]
    [InlineData(1970, "ROW", 1970)]
    [InlineData(1971, "ROW", 1971)]
    [InlineData(1970, "MGA", 1972)]
    [InlineData(1971, "MGA", 1973)]
    public async Task InvokeAsync_ShouldReturnErrorCodes_WhenPosapiExceptions(int code, string jurisdiction, int expectedCode)
    {
        // Arrange
        var exception = new PosApiException(posApiCode: code);
        httpContext.User = new ClaimsPrincipal(new ClaimsIdentity([
            new Claim(PosApiClaimTypes.JurisdictionId, jurisdiction)
        ], "mock"));
        mockAccountService
            .Setup(a => a.ValidateEmailVerificationCodeAsync(executionMode, emailKey))
            .ThrowsAsync(exception);

        // Act
        await target.InvokeAsync(httpContext);

        // Assert
        httpContext.Response.Headers.Location.ToString().Should().Be($"/en/mobileportal/verifyemail?code={expectedCode}");
        logger.Logged[0].Verify(LogLevel.Warning, exception, ("code", emailKey));
    }

    [Fact]
    public async Task InvokeAsync_ShouldReturnCode1970_WhenGeneralExceptionIsThrown()
    {
        // Arrange
        var exception = new Exception("General Error");

        mockAccountService
            .Setup(a => a.ValidateEmailVerificationCodeAsync(executionMode, emailKey))
            .ThrowsAsync(exception);

        // Act
        await target.InvokeAsync(httpContext);

        // Assert
        httpContext.Response.Headers.Location.ToString().Should().Be("/en/mobileportal/verifyemail?code=1970");
        logger.Logged[0].Verify(LogLevel.Error, exception, ("code", emailKey));
    }
}
