#nullable enable

using System;
using System.Collections.Generic;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Caching;

internal sealed class UserDataContainer(IDictionary<string, UserDataItem> items) : IDisposable
{
    public bool IsModified { get; set; }
    public bool IsDisposed { get; private set; }
    public IDictionary<string, UserDataItem> Items { get; } = items;

    public void Dispose()
        => IsDisposed = !IsDisposed ? true : throw GetDisposedException();

    public static Exception GetDisposedException() => new ObjectDisposedException(
        nameof(UserDataContainer),
        $"{nameof(UserDataContainer)} can't be accessed anymore because it was already written to {nameof(IDistributedCache)} by {nameof(UserDataContainerManager.OnContextEndAsync)}"
        + $" of {typeof(UserDataContainerManager)}. If you really need it at this point then move the writing to even later stage. Called from: {CallerInfo.Get()}");
}

internal sealed class UserDataItem(JToken value, UtcDateTime expires)
{
    [JsonIgnore] // B/c used only during context lifetime (e.g. HttpRequest)
    public object? DeserializedValue { get; set; }

    [JsonProperty("Value")]
    public JToken Json { get; } = value;

    public UtcDateTime Expires { get; } = expires;
}
