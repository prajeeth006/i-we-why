using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Features.Json.ActionResults;

/// <summary>
/// <see cref="IActionResult"/> decorator that adds error code to the response.
/// </summary>
public sealed class ErrorCodeResult : ExtendResultBase
{
    /// <summary>
    /// The error code.
    /// </summary>
    public string ErrorCode { get; }

    /// <summary>
    /// Initializes a new instance of the <see cref="ErrorCodeResult"/> class.
    /// </summary>
    /// <param name="innerResult">Current action result that will be wrapped and decorated by this class.</param>
    /// <param name="errorCode">The error code.</param>
    public ErrorCodeResult(IActionResult innerResult, string errorCode)
        : base(innerResult)
    {
        ErrorCode = errorCode;
    }

    /// <inheritdoc />
    protected override Task<IJsonResponseBodyExtensionWriter?> CreateWriter(HttpContext httpContext)
        => new ErrorCodeBodyExtensionWriter(ErrorCode).AsTask<IJsonResponseBodyExtensionWriter?>();
}

internal sealed class ErrorCodeBodyExtensionWriter(string errorCode) : IJsonResponseBodyExtensionWriter
{
    public string ErrorCode { get; } = errorCode;

    public Task Write(JObject body, JsonSerializer serializer, CancellationToken cancellationToken)
    {
        body["errorCode"] = ErrorCode;

        return Task.CompletedTask;
    }
}
