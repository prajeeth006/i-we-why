using System;
using System.Collections.Generic;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Content.Tests.Loading;

public abstract class TraceTestsBase
{
    protected TraceTestsBase(bool useTrace)
    {
        if (useTrace)
        {
            Trace = new List<object>();
            TraceFunc = Trace.Add;
        }
        else
        {
            Trace = null;
            TraceFunc = null;
        }
    }

    [CanBeNull]
    protected List<object> Trace { get; set; }

    [CanBeNull]
    protected Action<object> TraceFunc { get; set; }
}
