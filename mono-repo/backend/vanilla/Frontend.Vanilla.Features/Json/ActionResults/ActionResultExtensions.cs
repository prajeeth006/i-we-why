using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Features.Messages;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.Vanilla.Features.Json.ActionResults;

/// <summary>
/// Provides extension methods for <see cref="IActionResult"/>.
/// </summary>
public static class ActionResultExtensions
{
    /// <summary>
    /// Adds multiple messages to the response.
    /// </summary>
    /// <param name="actionResult"></param>
    /// <param name="messages"></param>
    /// <returns>Extended <see cref="IActionResult"/>.</returns>
    public static IActionResult WithMessages(this IActionResult actionResult, IEnumerable<ApiMessage> messages)
    {
        if (actionResult is MessageResult messageResult)
        {
            messageResult.Messages.AddRange(messages);

            return messageResult;
        }

        return new MessageResult(actionResult, messages.ToList());
    }

    /// <summary>
    /// Adds a technical error message to the response.
    /// </summary>
    /// <param name="actionResult">The result to be extended.</param>
    /// <param name="scope">Scope of the message.</param>
    /// <returns>Extended <see cref="IActionResult"/>.</returns>
    public static IActionResult WithTechnicalErrorMessage(this IActionResult actionResult, string scope = "")
    {
        return new TechnicalErrorMessageResult(actionResult, scope);
    }

    /// <summary>
    /// Adds a key value message to the response.
    /// </summary>
    /// <param name="actionResult">The result to be extended.</param>
    /// <param name="key">Key.</param>
    /// <param name="value">Value.</param>
    /// <returns>Extended <see cref="IActionResult"/>.</returns>
    public static IActionResult WithKeyValue(this IActionResult actionResult, string key, string value)
    {
        return new KeyValueMessageResult(actionResult, key, value);
    }

    /// <summary>
    /// Adds <c>values</c> property to the response.
    /// </summary>
    /// <param name="actionResult">The result to be extended.</param>
    /// <param name="values">The values.</param>
    /// <returns>Extended <see cref="IActionResult"/>.</returns>
    public static IActionResult WithValues(this IActionResult actionResult, IReadOnlyDictionary<string, string?> values)
    {
        return new ValuesResult(actionResult, values);
    }

    /// <summary>
    /// Adds an error message to the response.
    /// </summary>
    /// <param name="actionResult">The result to be extended.</param>
    /// <param name="message">The error message.</param>
    /// <param name="lifetime">Lifetime of the error message.</param>
    /// <param name="scope">Scope of the message.</param>
    /// <returns>Extended <see cref="IActionResult"/>.</returns>
    public static IActionResult WithErrorMessage(
        this IActionResult actionResult,
        string? message,
        ApiMessageLifetime lifetime = ApiMessageLifetime.Single,
        string scope = "")
    {
        return message != null
            ? WithMessages(actionResult, new[] { new ApiMessage(MessageType.Error, message, lifetime, scope) })
            : actionResult;
    }

    /// <summary>
    /// Adds an message to the response.
    /// </summary>
    /// <param name="actionResult">The result to be extended.</param>
    /// <param name="type">The message type.</param>
    /// <param name="message">The error message.</param>
    /// <param name="lifetime">Lifetime of the error message.</param>
    /// <param name="scope">Scope of the message.</param>
    /// <returns>Extended <see cref="IActionResult"/>.</returns>
    public static IActionResult WithMessage(
        this IActionResult actionResult,
        MessageType type,
        string message,
        ApiMessageLifetime lifetime = ApiMessageLifetime.Single,
        string scope = "")
    {
        return WithMessages(actionResult, new[] { new ApiMessage(type, message, lifetime, scope) });
    }

    /// <summary>
    /// Adds an info message to the response.
    /// </summary>
    /// <param name="actionResult">The result to be extended.</param>
    /// <param name="message">The info message.</param>
    /// <param name="lifetime">Lifetime of the error message.</param>
    /// <param name="scope">Scope of the message.</param>
    /// <returns>Extended <see cref="IActionResult"/>.</returns>
    public static IActionResult WithInfoMessage(
        this IActionResult actionResult,
        string message,
        ApiMessageLifetime lifetime = ApiMessageLifetime.Single,
        string scope = "")
    {
        return WithMessages(actionResult, new[] { new ApiMessage(MessageType.Information, message, lifetime, scope) });
    }

    /// <summary>
    /// Adds an warning message to the response.
    /// </summary>
    /// <param name="actionResult">The result to be extended.</param>
    /// <param name="message">The warning message.</param>
    /// <param name="lifetime">Lifetime of the error message.</param>
    /// <param name="scope">Scope of the message.</param>
    /// <returns>Extended <see cref="IActionResult"/>.</returns>
    public static IActionResult WithWarningMessage(
        this IActionResult actionResult,
        string message,
        ApiMessageLifetime lifetime = ApiMessageLifetime.Single,
        string scope = "")
    {
        return WithMessages(actionResult, new[] { new ApiMessage(MessageType.Warning, message, lifetime, scope) });
    }

    /// <summary>
    /// Adds an success message to the response.
    /// </summary>
    /// <param name="actionResult">The result to be extended.</param>
    /// <param name="message">The success message.</param>
    /// <param name="lifetime">Lifetime of the error message.</param>
    /// <param name="scope">Scope of the message.</param>
    /// <returns>Extended <see cref="IActionResult"/>.</returns>
    public static IActionResult WithSuccessMessage(
        this IActionResult actionResult,
        string message,
        ApiMessageLifetime lifetime = ApiMessageLifetime.Single,
        string scope = "")
    {
        return WithMessages(actionResult, new[] { new ApiMessage(MessageType.Success, message, lifetime, scope) });
    }

    /// <summary>
    /// Adds <c>errorCode</c> property to the response.
    /// </summary>
    /// <param name="actionResult">The result to be extended.</param>
    /// <param name="errorCode">The error code.</param>
    /// <returns>Extended <see cref="IActionResult"/>.</returns>
    public static IActionResult WithErrorCode(this IActionResult actionResult, string errorCode)
    {
        return new ErrorCodeResult(actionResult, errorCode);
    }
}
