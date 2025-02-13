using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public class RandomGeneratorTests
{
    [Fact]
    public void GetDouble_Test()
        => RunTest(RandomGenerator.GetBoolean);

    [Fact]
    public void GetInt32_Test()
        => RunTest(RandomGenerator.GetInt32);

    [Fact]
    public void GetInt32WithMax_Test()
        => RunTest(() => RandomGenerator.GetInt32(12), v => v.Should().BeLessThan(12));

    [Fact]
    public void GetEnum_Test()
        => RunTest(RandomGenerator.Get<DayOfWeek>);

    [Fact]
    public void GetBoolean_Test()
        => RunTest(RandomGenerator.GetBoolean);

    private static void RunTest<T>(Func<T> generate, Action<T> verify = null)
    {
        var values = Enumerable.Range(0, 100)
            .Select(_ => generate()).Distinct().ToList();

        values.Count.Should().BeGreaterThan(1);
        if (verify != null) values.Each(verify);
    }
}
