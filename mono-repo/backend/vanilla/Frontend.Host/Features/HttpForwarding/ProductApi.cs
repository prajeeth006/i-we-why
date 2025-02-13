using Ardalis.SmartEnum;

namespace Frontend.Host.Features.HttpForwarding;

public class ProductApi : SmartEnum<ProductApi, string>
{
    public static readonly ProductApi SharedFeatures = new (nameof(SharedFeatures), "sf-api");
    public static readonly ProductApi Sports = new (nameof(Sports), "sports-api");
    public static readonly ProductApi Oxygen = new (nameof(Oxygen), "coralsports-api");
    public static readonly ProductApi Promo = new (nameof(Promo), "promo-api");
    public static readonly ProductApi Portal = new (nameof(Portal), "portal-api");
    public static readonly ProductApi Payments = new (nameof(Payments), "payments-api");
    public static readonly ProductApi Engagement = new (nameof(Engagement), "engagement-api");
    public static readonly ProductApi Bingo = new (nameof(Bingo), "bingo-api");
    public static readonly ProductApi MokaBingo = new (nameof(MokaBingo), "mokabingo-api");
    public static readonly ProductApi Casino = new (nameof(Casino), "casino-api");
    public static readonly ProductApi Lotto = new (nameof(Lotto), "lotto-api");
    public static readonly ProductApi Horseracing = new (nameof(Horseracing), "horseracing-api");

    private ProductApi(string name, string value)
        : base(name, value)
    {
    }
}
