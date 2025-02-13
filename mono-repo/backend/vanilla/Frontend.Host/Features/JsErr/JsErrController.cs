using System.Diagnostics.CodeAnalysis;
using System.Text;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Serilog.Context;

namespace Frontend.Host.Features.JsErr;

[NeverRenewAuthentication]
[AllowAnonymous]
[BypassAntiForgeryToken]
[Route("log")]
[ApiController]
public class JsErrController : BaseController
{
    private readonly ILogger log;
    private readonly IClientIPResolver clientIpResolver;
    private readonly IGlobalJavascriptErrorHandlerConfiguration globalErrorHandlerConfiguration;

    public JsErrController(IServiceProvider container, ILogger<JsErrController> log)
        : this(container.GetRequiredService<IClientIPResolver>(), container.GetRequiredService<IGlobalJavascriptErrorHandlerConfiguration>(), log) { }

    internal JsErrController(IClientIPResolver clientIpResolver, IGlobalJavascriptErrorHandlerConfiguration globalErrorHandlerConfiguration, ILogger<JsErrController> log)
    {
        this.clientIpResolver = clientIpResolver;
        this.globalErrorHandlerConfiguration = globalErrorHandlerConfiguration;
        this.log = log;
    }

    [HttpPost]
    public IActionResult Post([FromBody] ErrorData[] errors)
    {
        if (!globalErrorHandlerConfiguration.IsEnabled)
        {
            return Ok();
        }

        try
        {
            foreach (var error in errors.Take(globalErrorHandlerConfiguration.MaxErrorsPerBatch))
            {
                if (error.type != null &&
                    globalErrorHandlerConfiguration.DisableLogLevels.TryGetValue(error.type, out var regex) &&
                    (regex == null || (error.message != null && regex.IsMatch(error.message))))
                {
                    continue;
                }

                if (!error.time.IsNullOrEmpty())
                {
                    using (LogContext.PushProperty("clientLogTime", DateTimeOffset.FromUnixTimeMilliseconds(long.Parse(error.time!)).TimeOfDay))
                    {
                        LogMessage(error);
                    }
                }
                else
                {
                    LogMessage(error);
                }
            }

            return Ok();
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Could not log client side error");

            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }

    private void LogMessage(ErrorData error)
    {
        switch (error.type)
        {
            case "Trace":
                log.LogTrace("Tracing {message} happened on client at {time}", error.message, DateTimeOffset.FromUnixTimeMilliseconds(long.Parse(error.time!)));

                break;
            case "Debug":
                log.LogDebug(error.message);

                break;
            case "Info":
                log.LogInformation(error.message);

                break;
            case "Warn":
                log.LogWarning(error.message);

                break;
            case "Error":
                log.LogError(error.message);

                break;
            default:
                var ipAddress = clientIpResolver.Resolve().ToString();
                log.LogError("Client {@error} detected from {ipAddress}", error, ipAddress);

                break;
        }
    }

    [HttpHead]
    public IActionResult Head()
    {
        return Ok();
    }
}

[SuppressMessage("ReSharper", "SA1300", Justification = "Matches client side casing")]
public class ErrorData
{
#pragma warning disable IDE1006 // Naming Styles
    public string? cause { get; set; }
    public string? message { get; set; }
    public string? name { get; set; }
    public string? description { get; set; }
    public string? stack { get; set; }
    public string? stacktrace { get; set; }
    public string? sourceURL { get; set; }
    public string? line { get; set; }
    public string? number { get; set; }
    public string? lineNumber { get; set; }
    public string? columnNumber { get; set; }
    public string? fileName { get; set; }
    public string? arguments { get; set; }
    public string? source { get; set; }
    public string? href { get; set; }
    public string? userAgent { get; set; }
    public string? time { get; set; }
    public string? type { get; set; }
    public int occurrences { get; set; }
#pragma warning restore IDE1006 // Naming Styles

    public static string Format(ErrorData err, string clientIpAddress)
    {
        var sb = new StringBuilder();

        sb.AppendFormat("client ip: {0}", clientIpAddress).AppendLine();
        sb.AppendFormat("cause: {0}", err.cause).AppendLine();
        sb.AppendFormat("message: {0}", err.message).AppendLine();
        sb.AppendFormat("name: {0}", err.name).AppendLine();
        sb.AppendFormat("description: {0}", err.description).AppendLine();

        sb.AppendFormat("stack: {0}", err.stack).AppendLine();
        sb.AppendFormat("stacktrace: {0}", err.stacktrace).AppendLine();

        sb.AppendFormat("sourceURL: {0}", err.sourceURL).AppendLine();

        sb.AppendFormat("line: {0}", err.line).AppendLine();
        sb.AppendFormat("number: {0}", err.number).AppendLine();
        sb.AppendFormat("lineNumber: {0}", err.lineNumber).AppendLine();
        sb.AppendFormat("columnNumber: {0}", err.columnNumber).AppendLine();

        sb.AppendFormat("fileName: {0}", err.fileName).AppendLine();
        sb.AppendFormat("arguments: {0}", err.arguments).AppendLine();
        sb.AppendFormat("source: {0}", err.source).AppendLine();
        sb.AppendFormat("href: {0}", err.href).AppendLine();
        sb.AppendFormat("userAgent: {0}", err.userAgent).AppendLine();

        sb.AppendFormat("time: {0}", err.time).AppendLine();
        sb.AppendFormat("occurrences: {0}", err.occurrences).AppendLine();

        return sb.ToString();
    }

    public static List<ErrorData> Deserealize(string errors)
    {
        return JsonConvert.DeserializeObject<List<ErrorData>>(errors)!;
    }
}
