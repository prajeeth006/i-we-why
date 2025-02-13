using System.ComponentModel;

namespace Frontend.TestWeb.Features;

[Description("TestWeb test provider.")]
public interface ITestDslProvider
{
    [Description("Value that always fails.")]
    string FailingValue { get; }

    [Obsolete("Obsolete message that should be reported in /health/dsl.")]
    [Description("Value that is obsolete.")]
    string ObsoleteValue { get; }
}

public class TestDslProvider : ITestDslProvider
{
    public string FailingValue => throw new Exception("Should always fail in order to verify that /health/dsl still loads correctly.");
    public string ObsoleteValue => "ServerValue";
}
