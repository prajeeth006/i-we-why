#nullable enable

using System;
using System.Collections.Generic;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Documents;
#pragma warning disable 1591
/// <summary>
/// A client representation of <see cref="IPCImage"/>.
/// </summary>
public sealed class ClientPCImage : ClientPCBaseComponent
{
    public ContentImage? Image { get; set; }
    public ContentLink? ImageLink { get; set; }
    public string? ToolTip { get; set; }
    public string? IconName { get; set; }

    public static explicit operator ClientPCImage(KeyValuePair<string, ClientDocument>? v)
    {
        throw new NotImplementedException();
    }
}
