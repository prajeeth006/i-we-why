using Ardalis.SmartEnum;

namespace Frontend.TestWeb;

public sealed class Product : SmartEnum<Product, string>
{
    public static readonly Product TestWeb = new (nameof(TestWeb), "vanilla-testweb");
    public static readonly Product ThemePark = new (nameof(ThemePark), "themepark");

    private Product(string name, string value)
        : base(name, value) { }
}
