using Frontend.Vanilla.Features.TrackerId;
using Frontend.Vanilla.Testing.AbstractTests;

namespace Frontend.Vanilla.Features.Tests.TrackerId;

public class TrackerIdServicesTests : VanillaFeatureServicesTestsBase
{
    public static object TestCases => new DependencyInjectionTestCases
    {
        Services = new[]
        {
            typeof(ISignUpBonusResolver),
        },
    }.GetTestCases();
}
