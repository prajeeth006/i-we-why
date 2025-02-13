namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;

internal static class TestPriority
{
    public const ulong Product = 8;
    public const ulong Channel = 4;
    public const ulong Label = 2;
    public const ulong Environment = 1;

    public static ulong Calculate(bool hasProduct, bool hasChannel, bool hasLabel, bool hasEnvironment)
        => (hasProduct ? Product : 0)
           + (hasChannel ? Channel : 0)
           + (hasLabel ? Label : 0)
           + (hasEnvironment ? Environment : 0);
}
