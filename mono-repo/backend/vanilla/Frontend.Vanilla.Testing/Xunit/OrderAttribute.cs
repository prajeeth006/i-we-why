using System;

namespace Frontend.Vanilla.Testing.Xunit;

[AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
internal sealed class OrderAttribute(int order) : Attribute
{
    public int Order { get; } = order;
}
