namespace Frontend.Vanilla.Features.Date;

internal interface IDateConfiguration
{
    bool ShowMonthFirst { get; }
    bool ShowMonthLongName { get; }
}

internal sealed class DateConfiguration : IDateConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.UI.Date";

    public bool ShowMonthFirst { get; set; }
    public bool ShowMonthLongName { get; set; }
}
