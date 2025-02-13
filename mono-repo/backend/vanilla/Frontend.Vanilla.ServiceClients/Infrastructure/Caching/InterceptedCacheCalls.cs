using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Caching;

/// <summary>
/// Thread-safe performance-optimized collection of intercepted cache requests.
/// </summary>
internal sealed class InterceptedCacheCalls : IEnumerable<(PosApiDataType DataType, RequiredString Key, Type ClrType)>
{
    private readonly ReaderWriterLockSlim @lock = new ReaderWriterLockSlim();
    private readonly HashSet<(PosApiDataType, RequiredString, Type)> innerSet = new HashSet<(PosApiDataType, RequiredString, Type)>();

    public void Add(PosApiDataType dataType, RequiredString key, Type clrType)
    {
        var call = (dataType, key, clrType);
        bool isAlreadyContained;

        using (@lock.TakeRead()) // Don't use UpgradeableReadLock b/c super slow b/c it's exclusive
            isAlreadyContained = innerSet.Contains(call);

        if (!isAlreadyContained)
            using (@lock.TakeWrite())
                innerSet.Add(call);
    }

    public IEnumerator<(PosApiDataType DataType, RequiredString Key, Type ClrType)> GetEnumerator()
    {
        using (@lock.TakeRead())
            return innerSet.ToList().GetEnumerator();
    }

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
