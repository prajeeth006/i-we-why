using System;
using FluentAssertions;
using Frontend.Vanilla.Content.FieldConversion;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.FieldConversion;

public class FieldMappingTests
{
    private FieldMapping target;
    private Mock<IFieldConverter<int>> converter;

    public FieldMappingTests()
    {
        converter = new Mock<IFieldConverter<int>>();
        target = new FieldMapping<int>(converter.Object);

        converter.Setup(c => c.ToString()).Returns("TestConverter");
    }

    [Fact]
    public void ClrType_ShouldExposeGenericType()
        => target.ClrType.Should().Be(typeof(int));

    [Theory, ValuesData(null, "old shit")]
    public void ObsoleteMessage_ShouldBeExposed(string msgStr)
    {
        var msg = msgStr?.AsTrimmedRequired();
        target = new FieldMapping<int>(converter.Object, msg);

        target.ObsoleteMessage.Should().BeSameAs(msg); // Act
    }

    [Fact]
    public void Convert_ShouldConvertCorrectly()
    {
        var ctx = Mock.Of<IFieldConversionContext>();
        converter.Setup(c => c.Convert(ctx)).Returns(666);

        target.Convert(ctx).Should().Be(666); // Act
    }

    [Fact]
    public void ToString_ShouldDelegateToConverter()
        => target.ToString().Should().Be("TestConverter");

    [Fact]
    public void ShouldSerializeToJsonForDiagnostics()
        => JsonConvert.SerializeObject(target).Should().BeJson(@"{
                ClrType: 'System.Int32',
                Converter: 'TestConverter'
            }");

    [Fact]
    public void Converter_ShouldBeExposedForEasyComparison()
        => ((FieldMapping<int>)target).Converter.Should().BeSameAs(converter.Object);

#nullable enable
    public class ValueConverter : IFieldConverter<int>
    {
        public int Convert(IFieldConversionContext c) => throw new NotImplementedException();
    }

    [Fact]
    public void IsNullableReference_ShouldBeFalse_IfValueType()
        => RunNullableReferenceTest(new ValueConverter(), false);

    public class NullableValueConverter : IFieldConverter<int?>
    {
        public int? Convert(IFieldConversionContext c) => throw new NotImplementedException();
    }

    [Fact]
    public void IsNullableReference_ShouldBeFalse_IfNullableValueType()
        => RunNullableReferenceTest(new NullableValueConverter(), false);

    public class ReferenceConverter : IFieldConverter<string>
    {
        public string Convert(IFieldConversionContext c) => throw new NotImplementedException();
    }

    [Fact]
    public void IsNullableReference_ShouldBeFalse_IfReferenceType()
        => RunNullableReferenceTest(new ReferenceConverter(), false);

    public class NullableReferenceConverter : IFieldConverter<string?>
    {
        public string? Convert(IFieldConversionContext c) => throw new NotImplementedException();
    }

    [Fact]
    public void IsNullableReference_ShouldBeTrue_IfNullableReferenceType()
        => RunNullableReferenceTest(new NullableReferenceConverter(), true);

    private void RunNullableReferenceTest<T>(IFieldConverter<T> converter, bool expected)
        => new FieldMapping<T>(converter).IsNullableReference.Should().Be(expected);
}
