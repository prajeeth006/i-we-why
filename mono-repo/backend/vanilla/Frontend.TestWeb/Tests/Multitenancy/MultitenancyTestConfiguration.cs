namespace Frontend.TestWeb.Tests.Multitenancy;

public interface IMultitenancyTestConfiguration
{
    string Value { get; }
}

public class MultitenancyTestConfiguration : IMultitenancyTestConfiguration
{
    public const string FeatureName = "Vanilla.TestWeb.MultitenancyTest";
    public string Value { get; set; }
}
