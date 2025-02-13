using Xunit;
using Xunit.v3;

namespace Frontend.Vanilla.Testing.Xunit;

/// <summary>
/// Works just like [Fact] except that failures are retried (by default, 5 times).
/// </summary>
[XunitTestCaseDiscoverer(typeof(RetryFactDiscoverer))]
public class RetryFactAttribute : FactAttribute
{
    /// <summary>Max Retries.</summary>
    public int MaxRetries { get; set; } = 5;
}
