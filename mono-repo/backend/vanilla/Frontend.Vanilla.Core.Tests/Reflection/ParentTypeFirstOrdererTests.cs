using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Reflection;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Reflection;

public class ParentTypeFirstOrdererTests
{
    [Fact]
    public void ShouldPutParentTypesFirst()
    {
        var types = new[]
        {
            typeof(IFoo),
            typeof(IGrandParent),
            typeof(IBar),
            typeof(IParent),
        };

        var ordered = types.OrderParentsFirst().ToList(); // Act

        ordered.Should().BeEquivalentTo(types);
        VerifyOrder<IGrandParent, IParent>();
        VerifyOrder<IGrandParent, IBar>();
        VerifyOrder<IParent, IFoo>();

        void VerifyOrder<TParent, TChild>()
            where TChild : TParent
            => ordered.IndexOf(typeof(TParent)).Should().BeLessThan(ordered.IndexOf(typeof(TChild)),
                $"{typeof(TParent)} should be before {typeof(TChild)} but order is: {ordered.Join()}.");
    }

    public interface IFoo : IParent { }

    public interface IBar : IGrandParent, IOutside { }

    public interface IParent : IGrandParent { }

    public interface IGrandParent { }

    public interface IOutside { }
}
