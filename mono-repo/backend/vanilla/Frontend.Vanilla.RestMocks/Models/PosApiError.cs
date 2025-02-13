#nullable enable

using System.Collections.Generic;

namespace Frontend.Vanilla.RestMocks.Models;

internal sealed class PosApiError(int code, string? message, Dictionary<string, string>? values = null)
{
    public int Code { get; } = code;
    public string? Message { get; } = message;
    public Dictionary<string, string>? Values { get; set; } = values;
}
