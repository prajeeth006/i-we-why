using JetBrains.Annotations;

namespace Frontend.TestWeb;

public static class PlaygroundPlugin
{
    [CanBeNull]
    private static Product product;

    public static Product Product
    {
        get { return product ??= GetProduct(); }
    }

    private static Product GetProduct()
    {
        var value = Environment.GetEnvironmentVariable("VANILLA_DYNACON_PRODUCT") ?? throw new Exception("Environment variable VANILLA_DYNACON_PRODUCT is not set.");

        if (!Product.TryFromValue(value, out var p))
        {
            throw new Exception($"Detected not configured product: '{value}'");
        }

        return p;
    }

    public const string ContentRoot = "Playground-v1.0";
    public const string ThemeParkContentRoot = "M2ThemePark-v1.0";
    public const string PublicPagePath = ContentRoot + "/PublicPages/";
}
