using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Ioc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.WebIntegration.Core;

/// <summary>
/// Implementation of <see cref="ICurrentContextAccessor" /> for web applications.
/// </summary>
internal sealed class WebContextAccessor(IHttpContextAccessor httpContextAccessor, ILogger<WebContextAccessor> logger) : ICurrentContextAccessor
{
    private const string CurrentContextItemsKey = "Van:CurrentContextItems";
    private readonly Lock itemsLock = new ();
    private readonly AsyncLocal<ConcurrentDictionary<object, Lazy<object?>>> nonHttpItems = new AsyncLocal<ConcurrentDictionary<object, Lazy<object?>>>();

    public ConcurrentDictionary<object, Lazy<object?>> Items
    {
        get
        {
            var httpContext = httpContextAccessor.HttpContext;

            if (httpContext != null)
            {
                var requestScopedValuesProvider = httpContext.RequestServices.GetRequiredService<IRequestScopedValuesProvider>();
                return requestScopedValuesProvider.GetOrAddValue(CurrentContextItemsKey, _ => requestScopedValuesProvider.Items);
            }

            // Most likely background thread/task => new isolated items
            // ReSharper disable once InconsistentlySynchronizedField
            var items = nonHttpItems.Value;
            if (items == null)
                lock (itemsLock)
                    if ((items = nonHttpItems.Value) == null) // Double-checked locking
                        nonHttpItems.Value = items = new ConcurrentDictionary<object, Lazy<object?>>();

            logger.LogInformation("No HttpContext found for ICurrentContextAccessor implementation.");

            return items;
        }
    }
}
