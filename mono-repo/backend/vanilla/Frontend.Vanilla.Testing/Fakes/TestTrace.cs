using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;

namespace Frontend.Vanilla.Testing.Fakes;

internal sealed class TestRecordingTrace : IRecordingTrace
{
    public List<TraceRecord> Recorded { get; } = new List<TraceRecord>();

    public void Record(string operation, Exception exception, IDictionary<string, object> values)
    {
        Recorded.Add(new TraceRecord
        {
            Operation = operation,
            Exception = exception,
            Values = values,
        });
    }
}

internal sealed class TraceRecord
{
    public string Operation { get; set; }
    public Exception Exception { get; set; }
    public IDictionary<string, object> Values { get; set; }

    public void Verify(string message, params (string, object)[] values)
    {
        Verify(message, null, values);
    }

    public void Verify(string message, Exception exception, params (string, object)[] values)
    {
        Operation.Should().Be(message);
        Exception.Should().BeSameAs(exception);
        var expect = values.ToDictionary();
        Values.Should().BeEquivalentTo(expect);
    }
}
