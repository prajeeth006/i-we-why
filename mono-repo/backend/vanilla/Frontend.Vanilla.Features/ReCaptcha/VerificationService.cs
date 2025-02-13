#nullable disable

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.ReCaptcha;

/// <summary>
/// Verifies user's response to reCAPTCHA.
/// </summary>
internal interface IVerificationService
{
    Task<ReCaptchaVerificationResult> VerifyAsync(
        TrimmedRequiredString area,
        string usersResponse,
        Dictionary<string, object> additionalParameters,
        CancellationToken cancellationToken);

    Task<ReCaptchaAssessment> VerifyEnterpriseRawAsync(string usersResponse, CancellationToken cancellationToken);
}

internal sealed class VerificationService(
    IReCaptchaConfiguration config,
    IEnablementService enablementService,
    IClientIPResolver clientIpResolver,
    IHttpContextAccessor httpContextAccessor,
    IAssessmentService assessmentService,
    ILogger<VerificationService> log,
    IEnvironmentProvider environmentProvider)
    : IVerificationService
{
    private const string EnablementDisclaimer =
        "Most likely in the meantime reCAPTCHA was enabled in the config or failure count for particular IP was reached.";

    private const string FailureDisclaimer =
        "This may be regular traffic. However if failures happen too often for a single IP, then it may indicate a hacker attack.";

    private const double DefaultThreshold = 0.5;
    private const string EvasionDomainHeader = "X-Evasion-Domain";

    public async Task<ReCaptchaVerificationResult> VerifyAsync(
        TrimmedRequiredString area,
        string usersResponse,
        Dictionary<string, object> additionalParameters,
        CancellationToken cancellationToken)
    {
        GuardExecutedOnlyOnce(area, usersResponse);

        var enabled = await enablementService.IsEnabledAsync(area, cancellationToken);

        if (!enabled)
        {
            return new ReCaptchaVerificationResult(false, new[] { ReCaptchaErrorCodes.Disabled });
        }

        if (string.IsNullOrWhiteSpace(usersResponse))
        {
            var clientIp = clientIpResolver.Resolve();
            log.LogWarning(
                "Verification of EMPTY user's response for RecaptchaEnterprise at {@Area} for {ClientIP} is automatically unsuccessful. " +
                EnablementDisclaimer,
                area,
                clientIp);

            return new ReCaptchaVerificationResult(false, new[] { ReCaptchaErrorCodes.MissingUserResponse });
        }

        return await ExecuteAssessmentAsync(area, usersResponse, additionalParameters, cancellationToken);
    }

    public async Task<ReCaptchaAssessment> VerifyEnterpriseRawAsync(string usersResponse, CancellationToken cancellationToken)
    {
        var recaptchaEvent = GetRecaptchaEvent(usersResponse);
        var verifyData = await assessmentService.CreateAssessmentAsync(recaptchaEvent, cancellationToken);

        return verifyData;
    }

    private async Task<ReCaptchaVerificationResult> ExecuteAssessmentAsync(
        TrimmedRequiredString area,
        string usersResponse,
        Dictionary<string, object> additionalParameters,
        CancellationToken cancellationToken)
    {
        var errors = new List<string>();

        var logParameters = new OutcomeLogParameters
        {
            IsEnterprise = true,
            UsersResponse = usersResponse,
            Area = area,
            Errors = errors,
            AdditionalParameters = additionalParameters,
        };

        try
        {
            var clientIp = clientIpResolver.Resolve();
            var hasThreshold = config.Thresholds.TryGetValue(area, out var t);
            var configuredThreshold = hasThreshold ? (double?)t : null;

            if (!hasThreshold)
            {
                log.LogError(
                    "reCAPTCHA {@Area} is missing in the configuration VanillaFramework.Features.ReCaptcha -> Threshold, using default threshold of {DefaultThreshold}",
                    area,
                    DefaultThreshold);
            }

            var recaptchaEvent = GetRecaptchaEvent(usersResponse);
            var response = await assessmentService.CreateAssessmentAsync(recaptchaEvent, cancellationToken);

            logParameters.ClientIp = clientIp;
            logParameters.Threshold = configuredThreshold;
            logParameters.Reasons = response.RiskAnalysis?.Reasons;
            logParameters.ExtendedVerdictReasons = response.RiskAnalysis?.ExtendedVerdictReasons;
            logParameters.Action = response.TokenProperties?.Action;
            logParameters.Score = response.RiskAnalysis?.Score ?? 0.0;
            logParameters.HostName = response.TokenProperties?.Hostname;

            var evasionDomain = httpContextAccessor.GetRequiredHttpContext().Request.Headers.GetValue(EvasionDomainHeader);

            if (response.TokenProperties is not { Valid: true })
            {
                errors.Add(response.TokenProperties?.InvalidReason.ToString());
            }
            else if (config.EnableHostNameValidation &&
                     !response.TokenProperties.Hostname.EndsWith(environmentProvider.CurrentLabel) &&
                     !response.TokenProperties.Hostname.EndsWith(evasionDomain))
            {
                errors.Add(ReCaptchaErrorCodes.InvalidHostName);
            }

            if (response.RiskAnalysis?.Score < (configuredThreshold ?? DefaultThreshold))
            {
                errors.Add(ReCaptchaErrorCodes.ScoreThresholdNotMet);
            }

            if (errors.Any())
            {
                LogOutcome(false, logParameters);
            }
            else if (config.IsSuccessLogEnabled)
            {
                LogOutcome(true, logParameters);
            }

            return new ReCaptchaVerificationResult(!errors.Any(), errors.ToArray());
        }
        catch (Exception ex)
        {
            return HandleReCaptchaException(
                errors,
                ex,
                logParameters,
                $"reCAPTCHA Enterprise failed for user {usersResponse} in area {area.Value}.");
        }
    }

    private RecaptchaEvent GetRecaptchaEvent(string usersResponse)
        => new RecaptchaEvent
        {
            Token = usersResponse,
            UserAgent = httpContextAccessor.GetRequiredHttpContext().Request.Headers.GetValue(HttpHeaders.UserAgent),
            Ja3 = httpContextAccessor.GetRequiredHttpContext().Request.Headers.GetValue(HttpHeaders.XJa3Hash),
            UserIpAddress = config.IncludeUserIpAddress ? clientIpResolver.Resolve().ToString() : null,
            SiteKey = config.EnterpriseSiteKey,
        };

    private ReCaptchaVerificationResult HandleReCaptchaException(
        List<string> errors,
        Exception ex,
        OutcomeLogParameters logParameters,
        string message)
    {
        errors.Add(ex.Message);

        if (config.BypassTechnicalError)
        {
            errors.Add(ReCaptchaErrorCodes.Disabled);
            LogOutcome(false, logParameters);

            return new ReCaptchaVerificationResult(false, errors.ToArray(), -1);
        }

        LogOutcome(false, logParameters);

        throw new Exception(message, ex);
    }

    private void LogOutcome(bool isSuccess, OutcomeLogParameters logParameters)
    {
        var logMessageBuilder = new StringBuilder();

        var logParameterList = new List<object>
        {
            logParameters.UsersResponse,
            logParameters.Area,
            logParameters.ClientIp,
        };

        if (isSuccess)
        {
            logMessageBuilder.Append(logParameters.IsEnterprise
                ? "Successful verification of RecaptchaEnterprise "
                : "Successful reCAPTCHA verification {version} ");

            logMessageBuilder.Append("{usersResponse} at {area} for {clientIP}; (action: {action}, score: {score}");
        }
        else
        {
            logMessageBuilder.Append(logParameters.IsEnterprise
                ? "Verification of RecaptchaEnterprise "
                : "Verification of reCAPTCHA {version} ");

            logParameterList.Add(logParameters.Errors?.FirstOrDefault());
            logMessageBuilder.Append("{usersResponse} at {area} for {clientIP} was unsuccessful with ")
                .Append(logParameters.IsEnterprise ? "{recaptchaWarning}" : "{error}")
                .Append("(action: {action}, score: {score}");
        }

        logParameterList.Add(logParameters.Action);
        logParameterList.Add(logParameters.Score);

        if (logParameters.IsEnterprise)
        {
            logParameterList.Add(logParameters.Reasons != null ? string.Join('|', logParameters.Reasons) : string.Empty);
            logMessageBuilder.Append(", reasons: {reasons}");

            logParameterList.Add(logParameters.ExtendedVerdictReasons != null ? string.Join('|', logParameters.ExtendedVerdictReasons) : string.Empty);
            logMessageBuilder.Append(", extendedVerdictReasons: {extendedVerdictReasons}");

            logParameterList.Add(logParameters.HostName);
            logMessageBuilder.Append(", hostname: {hostname}");
        }
        else
        {
            logParameterList.Add(logParameters.Version);
        }

        if (logParameters.Threshold.HasValue)
        {
            logParameterList.Add(logParameters.Threshold.Value);
            logMessageBuilder.Append(", threshold: {threshold}");
        }

        if (config.LogAdditionalData)
        {
            foreach (var pair in logParameters.AdditionalParameters ?? new Dictionary<string, object>())
            {
                logParameterList.Add(pair.Value);
                logMessageBuilder.Append(", ").Append(pair.Key).Append(": {").Append(pair.Key).Append('}');
            }
        }

        logMessageBuilder.Append(')');

        var logMessage = isSuccess ? logMessageBuilder.ToString() : logMessageBuilder.Append(' ').Append(FailureDisclaimer).ToString();

        var args = logParameterList.ToArray();

        log.LogWarning(logMessage, args);
    }

    private void GuardExecutedOnlyOnce(TrimmedRequiredString area, string usersResponse)
    {
        var httpContext = httpContextAccessor.GetRequiredHttpContext();
        var contextKey = $"Van:ReCaptcha:{area}:{usersResponse}";
        var previousCall = httpContext.Items.GetValue(contextKey);

        if (previousCall != null)
            throw new Exception(
                $"Particular reCAPTCHA user's response can be verified only once but response '{usersResponse}' for area '{area}'"
                + $" was already verified even during current HTTP request at: {previousCall}");

        httpContext.Items[contextKey] = CallerInfo.Get();
    }
}
