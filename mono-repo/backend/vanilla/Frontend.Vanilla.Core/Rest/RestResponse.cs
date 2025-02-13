using System;
using System.Net;
using Frontend.Vanilla.Core.Rest.Formatters;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Rest;

/// <summary>
/// REST response with all data received from a service.
/// </summary>
public sealed class RestResponse
{
    /// <summary>
    /// Creates a new instance.
    /// </summary>
    public RestResponse(RestRequest request)
        => this.request = Guard.NotNull(request, nameof(request));

    /// <summary>
    /// Gets or sets the HTTP status code.
    /// </summary>
    public HttpStatusCode StatusCode { get; set; } = HttpStatusCode.OK;

    private string? statusDescription;

    /// <summary>Gets or sets the status description. If set to null or whitespace string, <see cref="StatusCode" /> is used instead. That's also default value.</summary>
    public string StatusDescription
    {
        get => statusDescription != null && !string.IsNullOrWhiteSpace(statusDescription) ? statusDescription : StatusCode.ToString();
        set => statusDescription = value;
    }

    private RestRequest request;

    /// <summary>Gets or sets the request which led to this response.</summary>
    public RestRequest Request
    {
        get => request;
        set => request = Guard.NotNull(value, nameof(value));
    }

    /// <summary>Gets the headers returned by the server.</summary>
    public RestResponseHeaders Headers { get; } = new ();

    private byte[] content = Array.Empty<byte>();

    /// <summary>Gets or sets the content bytes.</summary>
    public byte[] Content
    {
        get => content;
        set => content = Guard.NotNull(value, nameof(value));
    }

    /// <summary>Strongly-typed version of <see cref="Deserialize" />.</summary>
    public T Deserialize<T>(IRestFormatter formatter)
        where T : notnull
        => (T)Deserialize(typeof(T), formatter);

    /// <summary>Deserializes <see cref="Content" /> to requested type using given formatter. Throws if <c>null</c> is deserialized.</summary>
    public object Deserialize(Type type, IRestFormatter formatter)
    {
        Guard.NotNull(type, nameof(type));
        Guard.NotNull(formatter, nameof(formatter));

        try
        {
            if (StatusCode == HttpStatusCode.NoContent) return new object();

            var result = formatter.Deserialize(content, type);

            return result ?? throw new NullDeserializedException();
        }
        catch (Exception ex)
        {
            var contentStr = MessageUtil.Truncate(content.DecodeToString(), maxLength: 1000);
            var msg =
                $"Failed deserializing {type} using {formatter} from body of the response to {request?.ToString() ?? "(unknown request)"} which is {(int)StatusCode} {StatusCode}. Body content: {contentStr}";

            throw new RestResponseDeserializationException(msg, ex);
        }
    }

    private TimeSpan executionDuration = TimeSpan.FromTicks(1);

    /// <summary>Gets or sets the execution duration.</summary>
    public TimeSpan ExecutionDuration
    {
        get => executionDuration;
        set => executionDuration = Guard.Greater(value, TimeSpan.Zero, nameof(value));
    }

    /// <summary>Returns status code with its description e.g. "500 InternalServerError".</summary>
    public override string ToString()
        => $"{(int)StatusCode} {StatusDescription}";
}
