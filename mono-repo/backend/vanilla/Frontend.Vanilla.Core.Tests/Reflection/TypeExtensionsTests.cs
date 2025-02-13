using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Testing.FluentAssertions;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Reflection;

public sealed class TypeExtensionsTests
{
    [Theory]
    [InlineData(typeof(string), true)]
    [InlineData(typeof(TypeExtensionsTests), true)]
    [InlineData(typeof(List<string>), true)]
    [InlineData(typeof(IList<string>), false)]
    [InlineData(typeof(List<>), false)]
    [InlineData(typeof(int), false)]
    [InlineData(typeof(JsonConverter), false)]
    [InlineData(typeof(IJsonLineInfo), false)]
    public void IsFinalClass_Test(Type type, bool expected)
        => type.IsFinalClass().Should().Be(expected);

    [Theory]
    [InlineData(typeof(string), null)]
    [InlineData(typeof(object), null)]
    [InlineData(typeof(int), 0)]
    [InlineData(typeof(bool), false)]
    [InlineData(typeof(DayOfWeek), DayOfWeek.Sunday)]
    [InlineData(typeof(int?), null)]
    [InlineData(typeof(DayOfWeek?), null)]
    public void GetDefaultValue_Test(Type type, object expected)
        => type.GetDefaultValue().Should().Be(expected);

    [Theory]
    [InlineData(typeof(string), true)]
    [InlineData(typeof(int), false)]
    [InlineData(typeof(DayOfWeek?), true)]
    public void CanBeNullTest(Type type, bool expected)
        => type.CanBeNull().Should().Be(expected);

    private interface IGrandParent
    {
        int GrandMember { get; }
    }

    private interface IParent : IGrandParent
    {
        string ParentMember();
    }

    private interface IFoo : IParent
    {
        bool FooMember();
    }

    [Fact]
    public void GetFlattenedInterfaceMembers_Test()
    {
        var members = typeof(IFoo).GetFlattenedInterfaceMembers(); // Act
        members.Select(m => m.Name).Should().BeEquivalentTo("GrandMember", "ParentMember", "FooMember");
    }

    public static TheoryData<Type, string> ToCSharpTestCases => new TheoryData<Type, string>
    {
        { typeof(void), "void" },
        { typeof(string), "System.String" },
        { typeof(List<int>), "System.Collections.Generic.List<System.Int32>" },
        { typeof(int?), "System.Nullable<System.Int32>" },
        { typeof(Task<List<int>>), "System.Threading.Tasks.Task<System.Collections.Generic.List<System.Int32>>" }, // Double generics
        { typeof(Dictionary<string, int>), "System.Collections.Generic.Dictionary<System.String, System.Int32>" }, // 2 generic params
        { typeof(List<>), "System.Collections.Generic.List<T>" }, // Unbound generics
        { typeof(IFoo), "Frontend.Vanilla.Core.Tests.Reflection.TypeExtensionsTests.IFoo" }, // Nested type
        { typeof(List<>.Enumerator), "System.Collections.Generic.List<T>.Enumerator" }, // Nested generic type
    };

    [Theory, MemberData(nameof(ToCSharpTestCases))]
    public void ToCSharp_Test(Type type, string expected)
        => type.ToCSharp().Should().Be(expected);

    [Fact]
    public void ToCSharp_TestUnboundGenericArg()
        => ToCSharp_Test(typeof(List<>).GetGenericArguments()[0], "T"); // Test on its own b/c xUnit is stupid

    public interface INestedGeneric<T> { }

    [Fact]
    public void ToCSharp_ShouldThrow_IfNestedType()
        => new Action(() => typeof(INestedGeneric<int>).ToCSharp())
            .Should().Throw<ArgumentException>();

    public interface IPublicMemberTest
    {
        string Foo { get; }
    }

    public class NonPublicMemeberTest
    {
        private string Foo { get; }
    }

    public class StaticMemeberTest
    {
        private static string Foo { get; }
    }

    [Theory]
    [InlineData(typeof(IPublicMemberTest))]
    [InlineData(typeof(NonPublicMemeberTest))]
    [InlineData(typeof(StaticMemeberTest))]
    public void GetRequired_ShouldFetchMemberWithParticularName(Type type)
    {
        // Act
        var property = type.GetRequired<PropertyInfo>("Foo");

        property.DeclaringType.Should().Be(type);
        property.Name.Should().Be("Foo");
        property.PropertyType.Should().Be(typeof(string));
        property.GetMethod.Should().NotBeNull();
    }

    public interface IMissingMemberTest
    {
        string Foo { get; }
        int Bar { get; set; }
        void Ignored();
    }

    [Fact]
    public void ShouldThrow_IfMissingMember()
        => new Action(() => typeof(IMissingMemberTest).GetRequired<PropertyInfo>("Wtf"))
            .Should().Throw()
            .WithMessage($"Missing required property 'Wtf' on {typeof(IMissingMemberTest)}. Existing property-s: System.String Foo, Int32 Bar.");

    public interface IMultipleMembersTests
    {
        string Calculate();
        string Calculate(int x);
        int Ignored { get; }
    }

    [Fact]
    public void ShouldThrow_IfMultipleMembers()
        => new Action(() => typeof(IMultipleMembersTests).GetRequired<MethodInfo>(nameof(IMultipleMembersTests.Calculate)))
            .Should().Throw()
            .WithMessage($"Multiple method-s with name 'Calculate' found on {typeof(IMultipleMembersTests)}. Change names or retrieve desired method using different API."
                         + " Found methods: System.String Calculate(), System.String Calculate(Int32).");
}
