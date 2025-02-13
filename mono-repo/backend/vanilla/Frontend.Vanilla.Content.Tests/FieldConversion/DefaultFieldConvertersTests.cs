using System.Reflection;
using FluentAssertions;
using Frontend.Vanilla.Content.FieldConversion;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.FieldConversion;

public class DefaultFieldConvertersTests
{
    [Fact]
    public void ShouldExposeConverters()
    {
        var target = new DefaultFieldConverters();
        var props = typeof(DefaultFieldConverters).GetProperties(BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public);

        // Just check some public and internal converter to make sure that reflection works
        props.Should().Contain(p => p.Name == nameof(DefaultFieldConverters.Bool));
        props.Should().Contain(p => p.Name == nameof(DefaultFieldConverters.ProxyRules));

        foreach (var prop in props)
        {
            var converter = prop.GetValue(target);
            converter.Should().NotBeNull();
        }
    }
}
