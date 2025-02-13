using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Messages;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Features.Json.ActionResults;

/// <summary>
/// <see cref="IActionResult"/> decorator that adds messages for client to the response.
/// </summary>
public class MessageResult : ExtendResultBase
{
    /// <summary>List of messages to add.</summary>
    public List<ApiMessage> Messages { get; }

    /// <summary>Initializes a new instance.</summary>
    public MessageResult(IActionResult innerResult, List<ApiMessage> messages)
        : base(innerResult)
        => Messages = messages;

    /// <inheritdoc />
    protected override Task<IJsonResponseBodyExtensionWriter?> CreateWriter(HttpContext httpContext)
        => new MessagesResponseBodyExtensionWriter(Messages).AsTask<IJsonResponseBodyExtensionWriter?>();
}

internal sealed class MessagesResponseBodyExtensionWriter(List<ApiMessage> messages) : IJsonResponseBodyExtensionWriter
{
    internal List<ApiMessage> Messages { get; } = messages;

    public Task Write(JObject body, JsonSerializer serializer, CancellationToken cancellationToken)
    {
        if (body["vnMessages"] == null)
        {
            body["vnMessages"] = new JArray();
        }

        foreach (var message in Messages)
        {
            var msg = new JObject
            {
                ["html"] = message.Content,
                ["type"] = message.Type.ToString(),
                ["lifetime"] = message.Lifetime.ToString(),
                ["scope"] = message.Scope,
            };

            ((JArray)body["vnMessages"]!).Add(msg);
        }

        return Task.CompletedTask;
    }
}
