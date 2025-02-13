using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.ReCaptcha;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ReCaptcha;

public sealed class VerificationServiceTests
{
    private const double DefaultThreshold = 0.5;
    private readonly IVerificationService target;
    private readonly ReCaptchaConfiguration config;
    private readonly Mock<IEnablementService> enablementService;
    private readonly Mock<IAssessmentService> assessmentService;
    private readonly Mock<IClientIPResolver> clientIPResolver;
    private readonly Mock<IEnvironmentProvider> environmentProvider;
    private readonly Mock<IHttpContextAccessor> httpContextAccessor;
    private readonly TestLogger<VerificationService> log;
    private readonly CancellationToken ct;
    private readonly IPAddress clientIp;

    public VerificationServiceTests()
    {
        config = CreateReCaptchaConfiguration();
        enablementService = new Mock<IEnablementService>();
        assessmentService = new Mock<IAssessmentService>();
        clientIPResolver = new Mock<IClientIPResolver>();
        environmentProvider = new Mock<IEnvironmentProvider>();
        httpContextAccessor = CreatedHttpContextAccessor();
        log = new TestLogger<VerificationService>();

        target = new VerificationService(
            config,
            enablementService.Object,
            clientIPResolver.Object,
            httpContextAccessor.Object,
            assessmentService.Object,
            log,
            environmentProvider.Object);

        clientIp = IPAddress.Parse("1.2.3.4");
        ct = TestCancellationToken.Get();
        enablementService.Setup(s => s.IsEnabledAsync("Login", ct)).ReturnsAsync(true);
        clientIPResolver.Setup(r => r.Resolve()).Returns(clientIp);
        environmentProvider.SetupGet(x => x.CurrentLabel).Returns("bwin.com");
    }

    [Fact]
    public async Task ShouldAllowToBeExecutedOnlyOnceDuringHttpRequest()
    {
        Func<Task> act = () => target.VerifyAsync("Registration", "foo", new Dictionary<string, object>(), ct);
        await act();

        (await act.Should().ThrowAsync<Exception>()).Which.Message.Should()
            .StartWith(
                "Particular reCAPTCHA user's response can be verified only once but response 'foo' for area 'Registration' was already verified even during current HTTP request at: ")
            .And.ContainAll(nameof(VerificationServiceTests), nameof(ShouldAllowToBeExecutedOnlyOnceDuringHttpRequest));
    }

    [Theory]
    [MemberData(nameof(GetVerifyAsyncShouldVerifyAssessmentForRecaptchaEnterpriseTestCases))]
    public async Task VerifyAsyncShouldVerifyAssessmentForRecaptchaEnterprise(
        bool expectedPassed,
        double score,
        string loggedErrorCode,
        Dictionary<string, object> additionalParameter,
        bool tokenValid,
        string hostname,
        bool hostValidationEnabled)
    {
        config.EnableHostNameValidation = hostValidationEnabled;

        assessmentService.Setup(x => x.CreateAssessmentAsync(It.IsAny<RecaptchaEvent>(), ct))
            .Returns(Task.FromResult(new ReCaptchaAssessment
            {
                TokenProperties = new TokenProperties
                {
                    Action = "action",
                    Valid = tokenValid,
                    Hostname = hostname,
                    InvalidReason = InvalidReasons.MALFORMED,
                },
                RiskAnalysis = new RiskAnalysis
                {
                    Score = score,
                    Reasons = new[] { ClassificationReasons.CLASSIFICATION_REASON_UNSPECIFIED },
                    ExtendedVerdictReasons = new[] { "known-bot" },
                },
            }));

        var result = await target.VerifyAsync("Login", "foo", additionalParameter, ct); // Act

        result.Success.Should().Be(expectedPassed);

        if (loggedErrorCode != null)
        {
            log.Logged.Single().Verify(
                LogLevel.Warning,
                new Dictionary<string, object>
                {
                    { "usersResponse", "foo" },
                    { "area", (TrimmedRequiredString)"Login" },
                    { "clientIP", clientIp },
                    { "recaptchaWarning", loggedErrorCode },
                    { "action", "action" },
                    { "score", score },
                    { "reasons", ClassificationReasons.CLASSIFICATION_REASON_UNSPECIFIED.ToString() },
                    { "extendedVerdictReasons", "known-bot" },
                    { "hostname", hostname },
                    { "threshold", DefaultThreshold },
                    additionalParameter ?? new Dictionary<string, object>(),
                });

            return;
        }

        log.VerifyNothingLogged();
    }

    public static IEnumerable<object[]> GetVerifyAsyncShouldVerifyAssessmentForRecaptchaEnterpriseTestCases()
    {
        yield return GetTestCase(true, 1, null);
        yield return GetTestCase(false, 0, "score-threshold-not-met");
        yield return GetTestCase(true, 1, null, new Dictionary<string, object> { { "A", null }, { "B", "A" } });
        yield return GetTestCase(false, 1, "MALFORMED", null, false, "");
        yield return GetTestCase(false, 1, "invalid-hostname", null, true, "anotherdomain.com");
        yield return GetTestCase(true, 1, null, null, true, "anotherdomain.com", false);
        yield return GetTestCase(true, 1, null, null, true, "evasionDomain.com");
    }

    [Fact]
    public async Task VerifyAsync_ShouldLogWarningWhenEnabled_OnSuccessfulAssessmentForRecaptchaEnterprise()
    {
        config.IsSuccessLogEnabled = true;

        assessmentService.Setup(x => x.CreateAssessmentAsync(It.IsAny<RecaptchaEvent>(), ct))
            .Returns(Task.FromResult(new ReCaptchaAssessment
            {
                TokenProperties = new TokenProperties { Action = "action", Valid = true, Hostname = "bwin.com" },
                RiskAnalysis = new RiskAnalysis
                {
                    Score = 1,
                    Reasons = new[] { ClassificationReasons.CLASSIFICATION_REASON_UNSPECIFIED },
                    ExtendedVerdictReasons = new[] { "known-bot" },
                },
            }));

        // Act
        var result = await target.VerifyAsync("Login", "foo", new Dictionary<string, object>(), ct);

        log.Logged.Single().Verify(
            LogLevel.Warning,
            ("usersResponse", "foo"),
            ("area", (TrimmedRequiredString)"Login"),
            ("clientIP", clientIp),
            ("action", "action"),
            ("score", 1),
            ("reasons", ClassificationReasons.CLASSIFICATION_REASON_UNSPECIFIED.ToString()),
            ("extendedVerdictReasons", "known-bot"),
            ("hostname", "bwin.com"),
            ("threshold", DefaultThreshold));

        result.Success.Should().BeTrue();
    }

    private static object[] GetTestCase(
        bool expectedPassed,
        double score,
        string loggedErrorCode,
        Dictionary<string, object> additionalParameters = null,
        bool tokenValid = true,
        string hostName = "bwin.com",
        bool hostnameValidationEnabled = true)
        => new object[] { expectedPassed, score, loggedErrorCode, additionalParameters, tokenValid, hostName, hostnameValidationEnabled };

    private static Mock<IHttpContextAccessor> CreatedHttpContextAccessor()
    {
        var httpContextAccessor = new Mock<IHttpContextAccessor>();
        httpContextAccessor.SetupGet(a => a.HttpContext.Items).Returns(new Dictionary<object, object>());
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Headers).Returns(new HeaderDictionary
        {
            { "X-Evasion-Domain", "evasionDomain.com" },
        });

        return httpContextAccessor;
    }

    private static ReCaptchaConfiguration CreateReCaptchaConfiguration(Action<ReCaptchaConfiguration> setup = null)
    {
        var config = new ReCaptchaConfiguration
        {
            Thresholds = new Dictionary<string, double> { ["Login"] = DefaultThreshold },
            EnterpriseSecretKey = "EnterpriseJamesBond",
        };

        setup?.Invoke(config);

        return config;
    }
}
