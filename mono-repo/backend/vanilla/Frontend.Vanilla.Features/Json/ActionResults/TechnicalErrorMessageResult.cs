using System;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features.Messages;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Json.ActionResults;

/// <summary>
/// <see cref="IActionResult"/> decorator that adds technical error message for client to the response.
/// </summary>
public sealed class TechnicalErrorMessageResult : MessageResult
{
    /// <summary>Scope of the message.</summary>
    public string Scope { get; }

    /// <summary>Initializes a new instance.</summary>
    public TechnicalErrorMessageResult(IActionResult innerResult, string scope)
        : base(innerResult, Array.Empty<ApiMessage>().ToList())
        => Scope = scope;

    /// <inheritdoc />
    public override Task ExecuteResultAsync(ActionContext context)
    {
        var contentService = context.HttpContext.RequestServices.GetRequiredService<IContentService>();
        Messages.Add(new ApiMessage(
            MessageType.Error,
            contentService.GetRequiredString<IGenericListItem>("App-v1.0/Resources/Messages", o => o.VersionedList["TechnicalError"]),
            scope: Scope));

        return base.ExecuteResultAsync(context);
    }
}
