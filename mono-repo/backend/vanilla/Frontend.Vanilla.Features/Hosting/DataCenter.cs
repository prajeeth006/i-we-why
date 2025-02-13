using Ardalis.SmartEnum;

namespace Frontend.Vanilla.Features.Hosting;

internal class DataCenter : SmartEnum<DataCenter, string>
{
    // non-prod servers
    public static readonly DataCenter NonProd = new (nameof(NonProd), "AT1AT2-DEV");
    // europe
    public static readonly DataCenter Austria = new (nameof(Austria), "EU-AT");
    public static readonly DataCenter Belgium = new (nameof(Belgium), "EU-BE");
    public static readonly DataCenter France = new (nameof(France), "EU-FR");
    public static readonly DataCenter Ireland = new (nameof(Ireland), "EU-IE");
    public static readonly DataCenter Portugal = new (nameof(Portugal), "EU-PT");
    // us
    public static readonly DataCenter Arizona = new (nameof(Arizona), "US-AZ");
    public static readonly DataCenter Colorado = new (nameof(Colorado), "US-CO");
    public static readonly DataCenter DistrictOfColumbia = new (nameof(DistrictOfColumbia), "US-DC");
    public static readonly DataCenter Iowa = new (nameof(Iowa), "US-IA");
    public static readonly DataCenter Illinois = new (nameof(Illinois), "US-IL");
    public static readonly DataCenter Indiana = new (nameof(Indiana), "US-IN");
    public static readonly DataCenter Kansas = new (nameof(Kansas), "US-KS");
    public static readonly DataCenter Kentucky = new (nameof(Kentucky), "US-KY");
    public static readonly DataCenter Louisiana = new (nameof(Louisiana), "US-LA");
    public static readonly DataCenter Massachusetts = new (nameof(Massachusetts), "US-MA");
    public static readonly DataCenter Maine = new (nameof(Maine), "US-ME");
    public static readonly DataCenter Maryland = new (nameof(Maryland), "US-MD");
    public static readonly DataCenter Michigan = new (nameof(Michigan), "US-MI");
    public static readonly DataCenter Mississippi = new (nameof(Mississippi), "US-MS");
    public static readonly DataCenter Nevada = new (nameof(Nevada), "US-NV");
    public static readonly DataCenter NewJersey = new (nameof(NewJersey), "US-NJ");
    public static readonly DataCenter NewYork = new (nameof(NewYork), "US-NY");
    public static readonly DataCenter NorthCarolina = new (nameof(NorthCarolina), "US-NC");
    public static readonly DataCenter Ohio = new (nameof(Ohio), "US-OH");
    public static readonly DataCenter Pennsylvania = new (nameof(Pennsylvania), "US-PA");
    public static readonly DataCenter PuertoRico = new (nameof(PuertoRico), "US-PR");
    public static readonly DataCenter Tennessee = new (nameof(Tennessee), "US-TN");
    public static readonly DataCenter Virginia = new (nameof(Virginia), "US-VA");
    public static readonly DataCenter WestVirginia = new (nameof(WestVirginia), "US-WV");
    public static readonly DataCenter Wyoming = new (nameof(Wyoming), "US-WY");

    private DataCenter(string name, string value)
        : base(name, value)
    {
    }
}
